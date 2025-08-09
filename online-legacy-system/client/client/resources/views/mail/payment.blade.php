<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <title>Siparişiniz Alındı!</title>
</head>
<body>
<div class="d-flex align-items-center justify-content-center" style="height:100px;background: #aa4b6b;  /* fallback for old browsers */
background: -webkit-linear-gradient(to right, #3b8d99, #6b6b83, #aa4b6b);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to right, #3b8d99, #6b6b83, #aa4b6b);color:white;font-weight: bold;display:flex;align-items:center;justify-content:center /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
">
    <div>ASPAROS CONSULTING</div>
</div>
<div style="height: 50vh" class="d-flex align-items-center justify-content-center flex-column mt-5">
    <div><img src="{{asset('11.png')}}" class="img-fluid"  width="200" alt=""></div>
    <h3  class="mt-3" style="font-weight: bold">Siparişiniz başarıyla alınmıştır.Teşekkür ederiz!</h3>
    <p style="color:blue;font-size: 20px;font-weight: bold">Sipariş Numaranız: {{@$siparis_no}}</p>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" ></script>

</body>
</html>
