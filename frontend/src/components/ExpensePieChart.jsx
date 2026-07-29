import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";


const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#26A69A",
  "#775DD0"
];


function ExpensePieChart({data}) {


return (

<div

style={{

width:"500px",

height:"400px",

marginBottom:"30px"

}}

>


<h2>
Spend By Category
</h2>



<PieChart

width={500}

height={350}

>


<Pie

data={data}

dataKey="total"

nameKey="category"

cx="50%"

cy="50%"

outerRadius={120}

label

>


{

data.map((entry,index)=>(

<Cell

key={index}

fill={COLORS[index % COLORS.length]}

/>

))

}


</Pie>


<Tooltip/>


<Legend/>


</PieChart>


</div>


)


}


export default ExpensePieChart;