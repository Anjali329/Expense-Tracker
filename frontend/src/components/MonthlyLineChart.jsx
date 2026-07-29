import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";


function MonthlyLineChart({data}){

return(

<div style={{marginBottom:"30px"}}>

<LineChart
 width={700}
 height={350}
 data={data}
 margin={{
   top:20,
   right:30,
   left:50,
   bottom:20
 }}
>

<CartesianGrid />

<XAxis 
dataKey="month"
/>

<YAxis />

<Tooltip />


<Line
 type="monotone"
 dataKey="total"
/>


</LineChart>


</div>

)

}


export default MonthlyLineChart;