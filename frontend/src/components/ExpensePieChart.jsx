import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";


function ExpensePieChart({data}){


return(

<div>


<h2>
Spend By Category
</h2>


<PieChart
width={400}
height={300}
>


<Pie

data={data}

dataKey="total"

nameKey="category"

cx="50%"

cy="50%"

outerRadius={100}


/>


<Tooltip/>

<Legend/>


</PieChart>


</div>

)


}


export default ExpensePieChart;