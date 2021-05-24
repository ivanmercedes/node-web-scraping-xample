// Web Scraping Noticias del archivo general de la nacion

const puppeteer = require('puppeteer');
const fs = require('fs');

async function run(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let noticias = [];
    // await page.goto('http://agn.gob.do/index.php/noticias');
    // await page.screenshot({
    //     path:'screenshot.png'
    // })

    async function getPageData(pageNumber = 0){
        await page.goto(`http://agn.gob.do/index.php/noticias?start=${pageNumber}`);

        const data = await page.evaluate(()=> {
            const $noticias = document.querySelectorAll('.itemsnews');
            const pagina = 42;
            const totalPages = 4;
            const data = [];
            $noticias.forEach(($noticia)=>{
                data.push({
                    titulo: $noticia.querySelector('.title h2').textContent.trim(),
                    contenido: $noticia.querySelector('.content').textContent.trim(),
                    portada: $noticia.querySelector('img').src,
                    url: $noticia.querySelector('a').href
                })
            }) 
            return {
                noticias: data,
                totalPages,
                pagina
            }
            
        })
        noticias = [...noticias, data.noticias];
        
        if(pageNumber < data.pagina){
            getPageData(pageNumber+14);    
        }else{
            fs.writeFile('data.json', JSON.stringify(noticias), ()=>{
                console.log('Datos guardados');
                console.log(noticias);
            })
            await browser.close();
        }
    }
    getPageData();
  
}


run();