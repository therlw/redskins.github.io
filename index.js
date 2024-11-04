const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

const app = express();

// Steam API ayarları
passport.use(new SteamStrategy({
    returnURL: 'https://therlw.github.io/auth/steam/return', // Güncellendi
    realm: 'https://therlw.github.io/', // Güncellendi
    apiKey: 'D769F6828EAED68EA9D889DE07D4F398' // Steam API anahtarınızı buraya koyun
  },
  (identifier, profile, done) => {
    // Kullanıcı profili burada işlenir
    return done(null, profile);
  }
));

// Oturum yönetimi
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Kullanıcıyı oturum açmış hale getir
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Giriş URL'leri
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' })
);

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    // Başarılı giriş sonrası yönlendirme
    res.redirect('/profile'); // Kullanıcı profil sayfasına yönlendiriliyor
});

// Profil sayfası
app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.send(`Merhaba ${req.user.displayName}`);
});

// Ana sayfa
app.get('/', (req, res) => {
    res.send('<a href="/auth/steam">Steam ile Giriş Yap</a>');
});

// Sunucuyu dinleme
app.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor');
});
