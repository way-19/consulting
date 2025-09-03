<!DOCTYPE html>
<html lang="tr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
    <meta name="robots" content="noindex, nofollow">
    <title>Giriş Yap - Yönetim  Paneli</title>

    <link rel="shortcut icon" type="image/x-icon" href="{{asset('assets/img/favicon.png')}}">

    <link rel="stylesheet" href="{{asset('assets/css/bootstrap.min.css')}}">

    <link rel="stylesheet" href="{{asset('assets/plugins/fontawesome/css/fontawesome.min.css')}}">
    <link rel="stylesheet" href="{{asset('assets/plugins/fontawesome/css/all.min.css')}}">

    <link rel="stylesheet" href="{{asset('assets/css/style.css')}}">
</head>

<body class="account-page">

<div class="main-wrapper">
    <div class="account-content">
        <div class="login-wrapper">

            <div class="login-content">

                <div class="login-userset">
                    <form action="{{asset('login')}}" method="POST">
                        @csrf
                    <div class="login-userheading">
                        <h3>Giriş Yap</h3>
                        <h4>Hesabınıza giriş yapın</h4>
                    </div>
                    <div class="form-login">
                        <label>Epossta</label>
                        <div class="form-addons">
                            <input type="email" name="email" placeholder="Eposta adresinizi girin">
                            <img src="{{asset('assets/img/icons/mail.svg')}}" alt="img">
                        </div>
                    </div>
                    <div class="form-login">
                        <label>Password</label>
                        <div class="pass-group">
                            <input type="password" name="password" class="pass-input" placeholder="Şifrenizi girin">
                            <span class="fas toggle-password fa-eye-slash"></span>
                        </div>
                    </div>

                    <div class="form-login">
                        <button class="btn btn-login" type="submit">Giriş Yap</button>
                    </div>
                       @if(Request::session()->has('message'))
                            <div class="alert alert-danger">
                                {{Request::session()->get('message')}}
                            </div>

                        @endif
            </form>
                </div>

            </div>
            <div class="login-img">
                <img src="{{asset('assets/img/login.jpg')}}" alt="img">
            </div>
        </div>
    </div>
</div>


<script src="assets/js/jquery-3.6.0.min.js"></script>

<script src="assets/js/feather.min.js"></script>

<script src="assets/js/bootstrap.bundle.min.js"></script>

<script src="assets/js/script.js"></script>
</body>

</html>
