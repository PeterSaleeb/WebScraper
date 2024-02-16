const PORT = 8000
const axios = require('axios')
const express = require('express')
const cheerio = require('cheerio')
const fs = require('fs')

const app = express()

const url = "https://old.reddit.com/r/pics/" //site to scrape from
const imageDirectory = './downloaded_images' //directory to save images

if (!fs.existsSync(imageDirectory)) {
  fs.mkdirSync(imageDirectory);
}

axios(url).then(response => {
  const html = response.data
  const $ = cheerio.load(html)
  const posts = []
  // dcr-jfeohd
  $('.thing', html).each(async function(){
    // const url = "https://www.theguardian.com" + $(this).find('a').attr('href')
    // const title = $(this).text()
    const imgURL = $(this).find('a').attr('href')


    try {
      const imageResponse = await axios({
        method: 'GET',
        url: imgURL,
        responseType: 'stream' // Set the response type to 'stream' to handle binary data
      })

      const imagePath = `${imageDirectory}/image_${posts.length + 1}.jpg` // Naming the image file
      const writer = fs.createWriteStream(imagePath) // Create a writable stream

      imageResponse.data.pipe(writer) // Pipe the image data to the writer stream

      writer.on('finish', () => {
        console.log(`Image downloaded and saved as ${imagePath}`)
      })

      writer.on('error', (err) => {
        console.error(`Error saving image: ${err}`)
      })

      posts.push({ imgURL, imagePath }) // Save the image URL and its local path
    } catch (error) {
      console.error(`Error downloading image: ${error}`)
    }
  })

  console.log(posts)
})

app.listen(PORT, () => console.log(`server running on port: ${PORT}`))