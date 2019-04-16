import Telegraf, { ContextMessageUpdate } from 'telegraf'

import { ResultData } from '@/helper/parser'
import Fetch from '@/helper/fetch'
import { TOKEN } from '@/config'

(async () => { // tslint:disable-line

  const bot = new Telegraf(TOKEN)
  const F = new Fetch()

  // F.parse({ url: 'https://www.istockphoto.com/de/en/photo/overpass-at-night-gm514520416-88146253'}, (data) => {
  //   console.log('1)', data)
  // })

  // F.parse({ url: 'https://www.istockphoto.com/de/en/photo/traffic-at-night-gm514506970-88132849'}, (data) => {
  //   console.log('2)', data)
  // })

  bot.start((ctx: ContextMessageUpdate) => ctx.replyWithHTML(
      `Welcome!\nI am a bot to search for photos from www.istockphoto.com in Google. \n\n` +
      `⚠ <b>Disclaimer</b>: The iStock photos found in Google are the subject of copyright laws,  ` +
      `and not allowed to be used for any pusposes. You need to buy them first on iStock.com. This bot was developed for education purposes only. ⚠\n\n` +
      `Send me a photo: [url]`,
  ))

  bot.help(({ replyWithHTML }: ContextMessageUpdate) => replyWithHTML(
      `Send me url of a photo from the istockphoto.com.` +
      `Example: https://www.istockphoto.com/de/en/photo/motion-cars-go-through-city-gm517533970-89535141`,
      ),
  )

  bot.hears(
      /^https?:\/\/www.istockphoto.com/g,
      ({ message, reply, replyWithPhoto }: ContextMessageUpdate,
      ) => {

    const urlStock = message.text.trim()

    F.parse(urlStock, (data: ResultData|null, error: string, url: string): void => {
      if (data === null) {
        reply(error + ' Sorry 😞')
        return
      }

      replyWithPhoto(
        data.img,
        {
          caption: 'Author: ' + data.photographer + ' — @istockBot',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🍭 Go to google!', url: data.googleLink },
              ],
            ],
          },
        },
      )
    })
  })

  bot.on('sticker', (ctx: ContextMessageUpdate) => ctx.reply('👍'))

  bot.catch((err: any) => {
    console.log('Ooops', err)
  })

  try {
    await bot.launch()
  } catch (err) {
    console.log(err)
  }
})()
