const emojicategoria = {
  info: '⁉️',
  main: '🦋'
}

let tags = {
  'main': '╭ *`𝐌𝐀𝐈𝐍`* ╯',
  'info': '╭ *`𝐈𝐍𝐅𝐎`* ╯'
}

const defaultMenu = {
  before: `╭⭒─ׄ─⊱ *𝐌𝐄𝐍𝐔 - 𝐁𝐎𝐓* ⊰
✦ 👤 \`Utente:\` *%name*
✧ 🪐 \`Attivo da:\` *%uptime*
✦ 💫 \`Utenti:\` *%totalreg*
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒\n
`.trimStart(),

  header: '      ⋆｡˚『 %category 』˚｡⋆\n╭',
  body: '*│ ➤* 『%emoji』%cmd',
  footer: '*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*\n',
  after: ``,
}

const swag = 'https://i.ibb.co/hJW7WwxV/varebot.jpg'

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {

    await conn.sendPresenceUpdate('composing', m.chat)

    let name = await conn.getName(m.sender) || 'Utente'
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => {
        return {
          help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
          tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
          prefix: 'customPrefix' in plugin,
        }
      })

    let menuTags = Object.keys(tags)

    let _text = [
      defaultMenu.before,
      ...menuTags.map(tag => {
        return defaultMenu.header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help
            .filter(menu => menu.tags && menu.tags.includes(tag) && menu.help)
            .map(menu => {
              return menu.help.map(help => {
                return defaultMenu.body
                  .replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                  .replace(/%emoji/g, emojicategoria[tag] || '❔')
                  .trim()
              }).join('\n')
            }),
          defaultMenu.footer
        ].join('\n')
      }),
      defaultMenu.after
    ].join('\n')

    let replace = {
      '%': '%',
      p: _p,
      uptime: uptime,
      name: name,
      totalreg: totalreg,
    }

    let text = _text.replace(
      new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'),
      (_, name) => '' + replace[name]
    )

    const buttons = [
      {
        buttonId: `${_p}menuia`,
        buttonText: { displayText: '🤖 IA' },
        type: 1
      },
      {
        buttonId: `${_p}menupremium`,
        buttonText: { displayText: '⭐ PREMIUM' },
        type: 1
      },
      {
        buttonId: `${_p}menustrumenti`,
        buttonText: { displayText: '🛠️ TOOLS' },
        type: 1
      },
      {
        buttonId: `${_p}menueuro`,
        buttonText: { displayText: '💰 EURO' },
        type: 1
      },
      {
        buttonId: `${_p}menugiochi`,
        buttonText: { displayText: '🎮 GIOCHI' },
        type: 1
      },
      {
        buttonId: `${_p}menugruppo`,
        buttonText: { displayText: '👥 GRUPPO' },
        type: 1
      },
      {
        buttonId: `${_p}menuricerche`,
        buttonText: { displayText: '🔍 SEARCH' },
        type: 1
      },
      {
        buttonId: `${_p}menudownload`,
        buttonText: { displayText: '📥 DOWNLOAD' },
        type: 1
      },
      {
        buttonId: `${_p}menucreatore`,
        buttonText: { displayText: '👑 OWNER' },
        type: 1
      }
    ]

    await conn.sendMessage(m.chat, {
      image: { url: swag },
      caption: text.trim(),
      footer: 'Seleziona un menu',
      buttons: buttons,
      headerType: 4
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    conn.reply(m.chat, `${global.errore}`, m)
  }
}

handler.help = ['menu']
handler.command = ['menu', 'menuall', 'menucompleto', 'funzioni', 'comandi', 'help']

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60

  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}