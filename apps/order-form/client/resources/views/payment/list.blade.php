@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">

            <div class="card mb-0">
                <div class="card-body">
                    <h4 class="card-title">Ödeme Listesi</h4>
                    <div class="table-responsive dataview">
                        <table class="table datatable ">
                            <thead>
                            <tr>
                                <th></th>
                                <th>Ad Soyad</th>
                                <th>Eposta Adresi</th>
                                <th>Telefon</th>
                                <th>Adres</th>
                                <th>Şirket Adları</th>
                                <th>Seçilen Ülkeler</th>
                                <th>Seçilen Bankalar</th>
                                <th>Ödenen Tutar</th>
                                <th>Ödeme Zamanı</th>
                                <th>Ödeme Durumu</th>
                                <th></th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                @foreach($payments as $payment)
                                    <tr>
                                        <td>{{"#".$payment->id}}</td>
                                        <td>{{$payment->name}}</td>
                                        <td>{{$payment->email}}</td>
                                        <td>{{$payment->phone}}</td>
                                        <td>{{$payment->address}}</td>
                                        <td>{{$payment->comp_names}}</td>
                                        <td>{{$payment->comp_country}}</td>
                                        <td>{{$payment->bank_services}}</td>
                                        <td>{{$payment->amount}}</td>
                                        <td>{{$payment->created_at}}</td>
                                        <td class="{{$payment->status == 'success' ? 'bg-success text-light' : 'bg-danger  text-lights'}}">{{$payment->status}}</td>
                                        <td>
                                            <a href="{{env('PROXY_URL'."uploads/".$payment->file)}}" target="_blank">Belge Görüntüle</a>
                                        </td>
                                        <td>
                                            <a  href="{{asset('mail-gonder?pid='.$payment->id)}}"><i data-feather="mail"></i></a>
                                        </td>
                                    </tr>
                                @endforeach

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection


