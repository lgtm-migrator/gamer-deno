module.exports = {
  "base": "/",
  "title": "Gamer",
  "description":
    "Banning Trolls! Generating currency! Leveling up users! Managing roles! Playing games!",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico",
      },
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "Home",
        "link": "/",
        "icon": "reco-home",
      },
      {
        "text": "Guides",
        "link": "/docs/",
        "icon": "reco-message",
      },
      {
        "text": "Discord",
        "icon": "reco-date",
        "link": "https://discord.gg/J4NqJ72",
      },
    ],
    "sidebar": {
      "/docs/": [
        "",
        "verification",
        "vip",
      ],
    },
    "type": "blog",
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "Skillz4Killz",
    "authorAvatar": "/avatar.gif",
    "record": "xxxx",
    "startYear": "2018",
  },
  "markdown": {
    "lineNumbers": true,
  },
};
