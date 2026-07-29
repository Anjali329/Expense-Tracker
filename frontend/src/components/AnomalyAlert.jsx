function AnomalyAlert({message}){


if(!message)
return null;


return(

<div>

<h3>
⚠️ Unusual Spending Detected
</h3>

<p>
{message}
</p>

</div>

)

}


export default AnomalyAlert;