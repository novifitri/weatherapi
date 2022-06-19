const searchBtn = document.querySelector('.btn')
const notFound = document.querySelector('.alert')
const closeAlert = document.querySelector(".close-alert")

closeAlert.addEventListener("click", function(){
    notFound.classList.remove("active")
})
document.addEventListener("DOMContentLoaded", function() {
    searchBtn.addEventListener("click", function(e){
        e.preventDefault()
        const key = document.querySelector('#keyword')
        if(key.value== "") {
            document.querySelector(".error").textContent = "Harap lokasi di isi"
        }else{
            getCuacaApi(key.value)
        }
    
    })
})


function getCuacabasedonButton(){
   const lists = document.querySelectorAll(".middle-wrapper li")
    for (const li of lists) {
        li.addEventListener("click", function() {
            getCuacaApi(li.textContent)
        })
    }
}
getCuacabasedonButton()
function getCuacaApi(city) {
    setLoading(true)
    document.querySelector(".error").textContent = ""
    fetch(`https://goweather.herokuapp.com/weather/${city}`)
    .then(response=>{
        response.json().then((data)=>{
            if(data.temperature == "") {
    
                notFound.classList.add("active")
                setTimeout(()=>{
                    notFound.classList.remove("active")
                }, 3000)
           
            }else {
                displayData(data, city)
            
            }
            setLoading(false)
        })
    })
    .catch(function (err){
        const msg = document.querySelector(".alert h6")
        msg.textContent = "Koneksi bermasalah"
        notFound.classList.add("active")
        setTimeout(()=>{
            notFound.classList.remove("active")
        }, 3000)
        setLoading(false)
        console.log(err)
    })
}
async function displayData(data, key) {
    const city = document.querySelector("#city")
    const kota = key.charAt(0).toUpperCase() + key.slice(1)
    city.textContent = kota
    console.log(data)
    const ramalan = data.forecast
    const suhu = document.querySelector(".info p:first-child")
    const angin = document.querySelector(".info p:last-child")
    const desc = document.querySelector(".icon-cuaca p")
    const daytemp = document.querySelectorAll('.bottom-details p:first-child')
    for (let index = 0; index < daytemp.length; index++) {
        daytemp[index].removeChild(daytemp[index].lastChild)
       daytemp[index].insertAdjacentHTML("beforeend", ramalan[index].temperature)
    }

    const daywind = document.querySelectorAll('.bottom-details p:last-child')
    for (let index = 0; index < ramalan.length; index++) {
        daywind[index].removeChild(daywind[index].lastChild)
        daywind[index].insertAdjacentHTML("beforeend", ramalan[index].wind)
    }
    //bersihkan dulu isi sebelumnya
    suhu.removeChild(suhu.lastChild)
    angin.removeChild(angin.lastChild)
    // desc.innerHTML = ""
    //tempel data yang baru
    suhu.insertAdjacentHTML("beforeend" , data.temperature.substring(1))
    angin.insertAdjacentHTML("beforeend", data.wind)
    document.querySelector('#keyword').value = ""
    try {
        const weather = await translate(data.description)
        desc.textContent = weather
        cekCuaca(weather)
    }catch(err){
        desc.textContent = data.description
        cekCuaca(data.description)
    }
  
}

function cekCuaca(data) {
    // console.log(data)
    const cuaca = data.toLowerCase()
    const iconCuaca = document.querySelector(".icon-cuaca img")
    if(cuaca.includes('hujan') || cuaca.includes("rain") ) {
        console.log("1")
        document.body.style.backgroundImage = `url('asset/images/hujan.jpg')`
        iconCuaca.setAttribute("src", "asset/images/rain.svg")
    }
    else if(cuaca.includes("cerah") || cuaca.includes("jernih") || cuaca.includes("sunny") || cuaca.includes("clear")) {
        console.log("2")
        iconCuaca.setAttribute("src", "asset/images/sun.svg")
        document.body.style.backgroundImage = 'url(asset/images/cerah.jpg)'
    }
    else if(cuaca.includes("berawan") || cuaca.includes("cloudy")) {
        console.log("3")
        iconCuaca.setAttribute("src", "asset/images/awan-sun.svg")
        document.body.style.backgroundImage = 'url(asset/images/berawan.jpg)'
    }else if(cuaca.includes("thunder") || cuaca.includes("petir")) {
        console.log("4")
        iconCuaca.setAttribute("src", "asset/images/thunder.svg")
        document.body.style.backgroundImage = 'url(asset/images/thunder.jpg)'
    }

}

//coba pake async await
const translate = async (text) =>{
    try{
        let response =  await fetch(`https://amm-api-translate.herokuapp.com/translate?engine=google&text=${text}&to=indonesian`)
        let jsonData = await response.json()
        let hasil = jsonData.data.result
        console.log(hasil)
        return hasil
    }catch(err){
        console.log(err)
    }
}
function dateIndoFormat(date){
    var date2 = {
        hari: date.getDay(),
        tanggal : date.getDate(),
        bulan: date.getMonth(),
        tahun: date.getFullYear(),
    }
    switch(date2.hari) {
        case 0:
            date2.hari = "Minggu"
            break;
        case 1:
            date2.hari = "Senin"
            break;
        case 2:
            date2.hari = "Selasa"
            break;
        case 3:
            date2.hari = "Rabu"
            break;
        case 4:
            date2.hari = "Kamis"
            break;
        case 5:
            date2.hari = "Jumat"
            break;
        case 6:
            date2.hari = "Sabtu"
            break;
    }
    switch(date2.bulan) {
        case 0 :date2.bulan = "Januari";break;
        case 1 :date2.bulan = "Februari";break;
        case 2 :date2.bulan = "Maret";break;
        case 3 :date2.bulan = "April";break;
        case 4 :date2.bulan = "Mei";break;
        case 5 :date2.bulan = "Juni";break;
        case 6 :date2.bulan = "Juli";break;
        case 7 :date2.bulan = "Agustus";break;
        case 8 :date2.bulan = "September";break;
        case 9 :date2.bulan = "Oktober";break;
        case 10 :date2.bulan = "November";break;
        case 11 :date2.bulan = "Desember";break;      
    }
    return date2
}

function getDate(){
    const wadah = document.querySelectorAll(".date")
    for (let index = 0; index < wadah.length; index++) {
        const date = new Date();
        date.setDate(date.getDate()+(index+1));
        const dateIndo = dateIndoFormat(date);
        wadah[index]. textContent = `${dateIndo.hari}, ${dateIndo.tanggal} ${dateIndo.bulan} ${dateIndo.tahun}`   
    } 
}
getDate()

function setLoading(kondisi) {
    const text = document.querySelectorAll("main p")
    const title = document.querySelector("#city")
    if(kondisi) {
        title.classList.add("load")
        for (const p of text) {
            p.classList.add("load")
        }
    }
    else {
        title.classList.remove("load")
        for (const p of text) {
            p.classList.remove("load")
        }
    }
}

