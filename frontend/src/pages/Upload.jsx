import { useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

function Upload() {

  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");

  const [dragActive, setDragActive] = useState(false);


  const uploadCSV = async () => {

    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }


    const formData = new FormData();

    formData.append("file", file);



    try {

      const token = localStorage.getItem("token");


      await api.post(
        "/transactions/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );


      setMessage("CSV uploaded successfully ✅");


    } catch(error) {

      console.log(error);

      setMessage("Upload failed ❌");

    }

  };

  const handleDragOver = (e) => {

  e.preventDefault();

  setDragActive(true);

};



const handleDragLeave = () => {

  setDragActive(false);

};



const handleDrop = (e) => {

  e.preventDefault();

  setDragActive(false);


  const uploadedFile = e.dataTransfer.files[0];


  if(uploadedFile){

    setFile(uploadedFile);

  }

};



  return (

    <>

    <Navbar />


    <div
      style={{
        minHeight:"80vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#f5f7fb"
      }}
    >


      <div
        style={{
          width:"450px",
          padding:"35px",
          background:"white",
          borderRadius:"15px",
          boxShadow:"0 5px 20px rgba(0,0,0,0.1)",
          textAlign:"center"
        }}
      >


        <h1>
          Upload Transactions CSV
        </h1>


        <p>
          Upload your bank transaction CSV file
        </p>

        <div

          onDragOver={handleDragOver}

          onDragLeave={handleDragLeave}

          onDrop={handleDrop}


          style={{

          border:"2px dashed",

          borderColor:
          dragActive
          ?
          "green"
          :
          "#888",

          padding:"40px",

          borderRadius:"10px",

          marginTop:"20px",

          cursor:"pointer"

          }}

          >


          <p>

          Drag & Drop CSV file here

          </p>


          <p>
          OR
          </p>


          <input

          type="file"

          accept=".csv"

          onChange={
          (e)=>setFile(e.target.files[0])
          }

          />


</div>

        



        {
          file &&

          <p>
            Selected: {file.name}
          </p>

        }



        <button

          onClick={uploadCSV}

          style={{
            marginTop:"20px",
            padding:"12px 25px",
            border:"none",
            borderRadius:"8px",
            background:"#2563eb",
            color:"white",
            fontSize:"16px",
            cursor:"pointer"
          }}

        >

          Upload CSV

        </button>



        <h3>
          {message}
        </h3>


      </div>


    </div>


    </>

  );

}


export default Upload;