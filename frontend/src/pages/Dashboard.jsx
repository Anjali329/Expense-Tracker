import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import ExpensePieChart from "../components/ExpensePieChart";

function Dashboard() {

  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [newCategory, setNewCategory] = useState("");

  const [filterCategory, setFilterCategory] = useState("");

  const [filterDate, setFilterDate] = useState("");

  const [sortAmount, setSortAmount] = useState(false);


  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    categorySpend: [],
    monthlySpend: [],
  });



  useEffect(() => {

    fetchTransactions();

    fetchSummary();

  }, []);



  const fetchTransactions = async () => {

    try {

      const token = localStorage.getItem("token");


      const response = await api.get(
        "/transactions",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      setTransactions(response.data.transactions);


    }
    catch(error){

      console.log(error);

      alert("Failed to load transactions");

    }

  };



  const fetchSummary = async () => {

    try{

      const token = localStorage.getItem("token");


      const response = await api.get(
        "/insights/summary",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      setSummary(response.data);


    }
    catch(error){

      console.log(error);

      alert("Failed to load summary");

    }

  };



  const saveCategory = async(id)=>{

    try{

      const token = localStorage.getItem("token");


      await api.patch(

        `/transactions/${id}`,

        {
          category:newCategory
        },

        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }

      );


      alert("Category Updated Successfully");


      setEditingId(null);


      fetchTransactions();

      fetchSummary();


    }
    catch(error){

      console.log(error);

      alert("Failed to update category");

    }

  };



  const displayedTransactions = transactions

  .filter((transaction)=>{


    const categoryMatch =
    filterCategory === "" ||
    transaction.category === filterCategory;



    const dateMatch =
    filterDate === "" ||
    new Date(transaction.date)
    .toISOString()
    .slice(0,10)
    === filterDate;



    return categoryMatch && dateMatch;


  })

  .sort((a,b)=>{


    if(sortAmount){

      return Number(b.amount)-Number(a.amount);

    }


    return 0;


  });



  return (

    <>

    <Navbar/>


    <div style={{padding:"20px"}}>


    <h1>
      Expense Tracker Dashboard
    </h1>



    <button

    onClick={()=>navigate("/upload")}

    style={{

      padding:"10px 20px",

      marginBottom:"20px",

      cursor:"pointer"

    }}

    >

    Upload CSV

    </button>





    <div

    style={{

      display:"flex",

      gap:"20px",

      marginBottom:"30px"

    }}

    >


    <div

    style={{

      border:"1px solid gray",

      borderRadius:"8px",

      padding:"20px",

      width:"220px"

    }}

    >

    <h3>
      Total Income
    </h3>

    <h2>
      ₹ {summary.totalIncome}
    </h2>

    </div>



    <div

    style={{

      border:"1px solid gray",

      borderRadius:"8px",

      padding:"20px",

      width:"220px"

    }}

    >

    <h3>
      Total Expense
    </h3>

    <h2>
      ₹ {summary.totalExpense}
    </h2>

    </div>


    </div>





    <h2>
      Category Spending
    </h2>

    <ExpensePieChart

    data={summary.categorySpend}

/>


    <table

    border="1"

    cellPadding="10"

    style={{

      width:"100%",

      borderCollapse:"collapse",

      marginBottom:"30px"

    }}

    >

    <thead>

    <tr>

    <th>Category</th>

    <th>Total</th>

    </tr>

    </thead>


    <tbody>


    {
      summary.categorySpend.map((item)=>(

        <tr key={item.category}>

        <td>
          {item.category}
        </td>


        <td>
          ₹ {item.total}
        </td>


        </tr>


      ))
    }


    </tbody>


    </table>





    <h2>
      Monthly Spending
    </h2>


    <table

    border="1"

    cellPadding="10"

    style={{

      width:"100%",

      borderCollapse:"collapse",

      marginBottom:"30px"

    }}

    >

    <thead>

    <tr>

    <th>Month</th>

    <th>Total Spending</th>

    </tr>

    </thead>


    <tbody>


    {
      summary.monthlySpend.map((item)=>(

        <tr key={item.month}>

        <td>
          {item.month}
        </td>


        <td>
          ₹ {item.total}
        </td>


        </tr>


      ))
    }


    </tbody>


    </table>






    <h2>
      Transactions ({displayedTransactions.length})
    </h2>



    <div style={{marginBottom:"20px"}}>


    <select

    value={filterCategory}

    onChange={(e)=>setFilterCategory(e.target.value)}

    >

    <option value="">
      All Categories
    </option>

    <option>Food</option>

    <option>Travel</option>

    <option>Shopping</option>

    <option>Bills</option>

    <option>Healthcare</option>

    <option>Entertainment</option>

    <option>Fuel</option>

    <option>Rent</option>

    <option>Income</option>

    <option>Needs Review</option>


    </select>



    <input

    type="date"

    value={filterDate}

    onChange={(e)=>setFilterDate(e.target.value)}

    style={{

      marginLeft:"20px"

    }}

    />



    <button

    onClick={()=>setSortAmount(!sortAmount)}

    style={{

      marginLeft:"20px"

    }}

    >

    Sort Amount

    </button>



    </div>





    <table

    border="1"

    cellPadding="10"

    style={{

      width:"100%",

      borderCollapse:"collapse"

    }}

    >


    <thead>

    <tr>

    <th>ID</th>

    <th>Date</th>

    <th>Description</th>

    <th>Category</th>

    <th>Amount</th>

    <th>Confidence</th>

    <th>Action</th>

    </tr>

    </thead>



    <tbody>


    {

    displayedTransactions.map((transaction)=>(


    <tr key={transaction.id}>


    <td>
      {transaction.id}
    </td>



    <td>

    {
      transaction.date

      ?

      new Date(transaction.date)
      .toLocaleDateString()

      :

      "-"

    }

    </td>



    <td>
      {transaction.description}
    </td>



    <td>


    {
      editingId===transaction.id

      ?

      <select

      value={newCategory}

      onChange={(e)=>setNewCategory(e.target.value)}

      >

      <option>Food</option>
      <option>Travel</option>
      <option>Bills</option>
      <option>Fuel</option>
      <option>Healthcare</option>
      <option>Entertainment</option>
      <option>Rent</option>
      <option>Income</option>
      <option>Needs Review</option>
      <option>Other</option>


      </select>


      :

      transaction.category

    }


    </td>




    <td>
      ₹ {transaction.amount}
    </td>




    <td>


    <span

    style={{

      background:

      Number(transaction.confidence)<0.7

      ?

      "red"

      :

      "green",


      color:"white",

      padding:"5px 10px",

      borderRadius:"10px"

    }}

    >

    {

    transaction.confidence

    ?

    (Number(transaction.confidence)*100)
    .toFixed(1)+"%"

    :

    "N/A"

    }


    </span>


    </td>




    <td>


    {

    editingId===transaction.id


    ?


    <button

    onClick={()=>saveCategory(transaction.id)}

    >

    Save

    </button>


    :


    <button

    onClick={()=>{

      setEditingId(transaction.id);

      setNewCategory(transaction.category);

    }}

    >

    Edit

    </button>


    }


    </td>



    </tr>


    ))

    }


    </tbody>


    </table>




    </div>


    </>

  );

}


export default Dashboard;