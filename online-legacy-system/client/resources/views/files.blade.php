
@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">
            <div class="card mb-0">
                <div class="card-body">
                    <h4 class="card-title">Yüklenen Belgeler</h4>
                    <hr>
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <td>Müşteri Ad Soyad</td>
                                <td>Belge Adı</td>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($payments as $payment)
                                <tr>
                                    <td>{{$payment->name}}</td>
                                    <td><a target="_blank" href="{{url(env('PROXY_URL').$payment->file)}}">{{$payment->file}}</a></td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
