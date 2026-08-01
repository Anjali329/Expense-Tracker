import { useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Upload() {

  const [file, setFile] = useState(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [loading, setLoading] = useState(false);


  const uploadCSV = async () => {

    if (!file) {
          toast.error("Please select a CSV file");
          return;
}


    const formData = new FormData();

    formData.append("file", file);



    try {
      setUploadInfo(null);
      setLoading(true);
      const token = localStorage.getItem("token");


      const response = await api.post(
    "/upload",
    formData,
    {
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"multipart/form-data"
        }
    }
);

toast.success(response.data.message);
setUploadInfo({
    inserted: response.data.inserted,
    duplicates: response.data.duplicates,
    totalRows: response.data.totalRows,
});

setLoading(false);

if (response.data.duplicates > 0) {
    toast.warning(
        `${response.data.duplicates} duplicate transactions skipped`
    );
}
    } catch (error) {

    console.log("========== UPLOAD ERROR ==========");
    console.log(error);

    setUploadInfo(null);
    setFile(null);

    setLoading(false);

    if (error.response) {

        toast.error(error.response.data.message);

    } else {

        toast.error("Server not responding");

    }

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
        minHeight:"100vh",
        padding:"20px",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#f5f7fb"
      }}
    >


      <div
        style={{
          width:"100%",
          maxWidth:"450px",
          padding:"35px",
          background:"white",
          borderRadius:"15px",
          boxShadow:"0 5px 20px rgba(0,0,0,0.1)",
          textAlign:"center",
          margin:"20px"
}}
      >


        <h1
          style={{
            fontSize: "28px",
            marginBottom: "10px",
            color: "#1f2937"
          }}
        >
          Upload Transactions CSV
</h1>


        <p
          style={{
            color: "#6b7280",
            marginBottom: "25px",
            lineHeight: "1.5"
          }}
        >
          Upload your bank transaction CSV file for automatic AI categorization.
</p>
        <div

          onDragOver={handleDragOver}

          onDragLeave={handleDragLeave}

          onDrop={handleDrop}


          style={{
            border:"2px dashed",
            borderColor: dragActive ? "green" : "#888",
            background: dragActive ? "#ecfdf5" : "#fafafa",
            transition:"0.3s ease",
            padding:"30px 20px",
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
                disabled={loading}
                style={{ marginTop: "10px" }}
                onChange={(e) => setFile(e.target.files[0])}
/>


</div>

        



        {
          file &&

          <p
            style={{
                marginTop:"10px",
                wordBreak:"break-word",
                color:"#444"
}}
>
Selected: {file.name}
</p>

        }



        <button

          onClick={uploadCSV}
          disabled={loading}

          style={{
            marginTop:"20px",
            width:"100%",
            padding:"14px",
            border:"none",
            borderRadius:"8px",
            background: loading ? "#9ca3af" : "#2563eb",
            cursor: loading ? "not-allowed" : "pointer", 
            color:"white",
            fontSize:"16px",
            fontWeight:"bold",
            transition:"0.3s"
}}
          >

          {loading ? "Uploading..." : "Upload CSV"}

        </button>
        {
          uploadInfo && (

          <div
          style={{
            marginTop:"20px",
            padding:"15px",
            background:"#f3f4f6",
            borderRadius:"8px",
            textAlign:"left"
}}
          >

          <p>
          <b>Total Rows:</b> {uploadInfo.totalRows}
          </p>

          <p>
          <b>Inserted:</b> {uploadInfo.inserted}
          </p>

          <p>
          <b>Duplicates:</b> {uploadInfo.duplicates}
          </p>

          </div>

          )
}


      </div>


    </div>
    <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
/>


    </>

  );

}


export default Upload;