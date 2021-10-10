import axios from 'axios';


getData();

async function getData(){
    const data=await axios.get('http://localhost:3000/new');
    console.log(data.data);
}