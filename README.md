# Readit: A Modern Reddit Feed
Website: [https://ltseng01.github.io/Readit](https://ltseng01.github.io/Readit)
![Main interface](screenshots/desktop_main.png)
![Main interface](screenshots/desktop_main_dark.png)

Introducing Readit, a brand new Reddit feed created with design in mind. Featuring an intuitive and elegant layout, it makes following up on your favorite Reddit posts easier with less distractions and clutter. Works on almost all screen sizes and browsers for maximum compatibility. When you open the webpage, it starts with the [r/popular](https://reddit.com/r/popular) subreddit. Change the text box at the top of the page to the subreddit of your choice and hit "Readit" to load the feed for that subreddit. Behind the scenes, the webpage makes an AJAX call to retrieve the JSON associated with that subreddit which by default includes a lot of metadata and the top posts. JavaScript functions clean up that data, keeping only what is necessary, and renders them onto the webpage using MustacheJS.

### Features:
- Dark Mode 🌒/☀️ – switch between interfaces depending on your operating system's settings
- Responsive Layout 📱 – works for all screen sizes from phone to desktop
- Clean Text – easy to read font and large characters
- Load More – satisfy your Reddit binge by loading more posts
- Thumbnails 🌉 – posts with images will have thumbnails 
– Animations – smooth animations bring in new posts

### Frameworks & Libraries:
- [Animate.css](https://daneden.github.io/animate.css/)
- [Bootstrap](https://getbootstrap.com)
- [JQuery](https://jquery.com)
- [Mustache](http://mustache.github.io)
- [Font Awesome](https://fontawesome.com)
- [Reddit API](https://www.reddit.com/dev/api/)

### Enter the wrong subreddit name? Get visual feedback.
![Validated entry](screenshots/bad_subreddit_name.gif)

### Mobile
![Mobile](screenshots/mobile_main.png)
![Mobile2](screenshots/mobile_footer.png)

### Tablet
![Tablet](screenshots/tablet_main.png)

### Questions or Bugs?
Feel free to create an issue or contact me! Thanks!
