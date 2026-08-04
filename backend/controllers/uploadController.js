const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const { spawnSync } = require("child_process");

const pool = require("../config/db");


const uploadCSV = async (req, res) => {
  console.log("🔥 uploadCSV controller reached");
  console.log(req.file);

  console.log(`📤 Upload started: ${req.file?.originalname}`);

  try {

    // Check Login
    if (!req.user) {
      return res.status(401).json({
        success:false,
        message:"Unauthorized"
      });
    }


    // Check CSV
    if (!req.file) {
      return res.status(400).json({
        success:false,
        message:"No CSV file uploaded"
      });
    }


    const results = [];

    let invalidFormat = false;
    let headersChecked = false;

    console.log("Opening file:", req.file.path);
      const parser = csv();

      fs.createReadStream(req.file.path)
        .pipe(parser)

        .on("data", (data) => {

            if (results.length >= 10) {
                return;
            }
            console.log("Reading row:", results.length + 1);
        // Validate first row headers
        
          if(results.length === 0){

    if (!headersChecked) {

        headersChecked = true;

        const headers = Object.keys(data);

        const hasDescription =
            headers.includes("Description") ||
            headers.includes("Narration") ||
            headers.includes("Remarks") ||
            headers.includes("merchant_category") ||
            headers.includes("clean_description");

        const hasAmount =
            headers.includes("Amount") ||
            headers.includes("Debit") ||
            headers.includes("Withdrawal Amt.") ||
            headers.includes("transaction_amount");

        if (!hasDescription || !hasAmount) {
            invalidFormat = true;
        }
    }

}
        if(invalidFormat){
          return;
        }



        const normalized = {

          date:
            data["Date"] ||
            data["Txn Date"] ||
            data["Transaction Date"] ||
            data["transaction_date"] ||
            data["Date "] ||
            "",


          description:
            data["Description"] ||
            data["Narration"] ||
            data["Remarks"] ||
            data["merchant_category"] ||
            data["clean_description"] ||
            "",


          amount:
            data["Amount"] ||
            data["Debit"] ||
            data["Withdrawal Amt."] ||
            data["transaction_amount"] ||
            0

        };



        // -------------------------
// AI Prediction
// -------------------------

const pythonResult = spawnSync(

    "python",

    [

        path.join(__dirname, "../../ml/scripts/predict.py"),

        normalized.description

    ],

    {

        encoding: "utf-8"

    }

);

if (pythonResult.error) {

    console.error("Python Error:", pythonResult.error);

    normalized.category = "Unknown";

    normalized.confidence = 0;

}
else {

    try {

        const prediction = JSON.parse(

            pythonResult.stdout.trim()

        );

        normalized.category = prediction.category;

        normalized.confidence = prediction.confidence;

    }

    catch (err) {

        console.error("Prediction Parse Error:", err);

        console.log("Python Output:", pythonResult.stdout);

        normalized.category = "Unknown";

        normalized.confidence = 0;

    }

}

results.push(normalized);
        

      
      })



      .on("end",async()=>{
        console.log("CSV parsing completed.");
        console.log("Total rows parsed:", results.length);

        console.log(results);


        try{


          // Invalid CSV check

          if(invalidFormat){

            return res.status(400).json({

              success:false,

              message:
              "Invalid CSV format. Required columns missing."

            });

          }



          // Empty CSV check

          if(results.length===0){

            return res.status(400).json({

              success:false,

              message:"CSV file is empty"

            });

          }



          let inserted=0;
          let duplicates=0;



          for(const transaction of results){



            // Duplicate check

            const existing =
            await pool.query(

              `
              SELECT id 
              FROM transactions
              WHERE user_id=$1
              AND description=$2
              AND amount=$3
              AND date=$4
              `,
              [

                req.user.id,

                transaction.description,

                transaction.amount,

                transaction.date || null

              ]

            );



            if(existing.rows.length>0){

              duplicates++;

              continue;

            }



            await pool.query(

              `
              INSERT INTO transactions
              (user_id,
              description,
              amount,
              category,
              confidence,
              date)

              VALUES($1,$2,$3,$4,$5,$6)
              `,

              [

                req.user.id,

                transaction.description,

                transaction.amount,

                transaction.category,

                transaction.confidence,

                transaction.date || null

              ]

            );


            inserted++;


          }



          console.log(
            `✅ Inserted ${inserted}, Duplicate ${duplicates}`
          );



          // Remove uploaded file

          fs.unlinkSync(req.file.path);



          res.status(200).json({

            success:true,

            message:"CSV upload completed",

            inserted,

            duplicates,

            totalRows:results.length,

            data:results

          });



        }


        catch(err){

          console.error(
            "Database Error:",
            err
          );


          res.status(500).json({

            success:false,

            message:"Database Error"

          });

        }


      })
      .on("error", (err) => {

        console.log("CSV ERROR:");
        console.log(err);

});



  }


  catch(error){


    console.error(error);


    res.status(500).json({

      success:false,

      message:"Internal Server Error"

    });


  }

};



module.exports={
  uploadCSV
};