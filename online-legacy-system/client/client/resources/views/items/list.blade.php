@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">

            <div class="card mb-0">
                <div class="card-body">
                    <h4 class="card-title">Paket İçeriği Listesi</h4>
                    <hr>
                    <div class="container text-end mb-3">
                        <a class="btn btn-primary" href="{{asset('yeni-icerik-ekle')}}">Yeni İçerik Ekle</a>
                    </div>
                    <div class="table-responsive dataview">
                        <table class="table datatable ">
                            <thead>
                            <tr>
                                <th></th>
                                <th>Paket İçeriği</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                @foreach($items as $item)
                                    <tr>
                                        <td>#{{$item->id}}</td>
                                        <td>{{$item->name}}</td>
                                        <td>
                                            <a href="{{asset('delete-item?item='.$item->id)}}" class="text-danger ms-4">Sil</a>
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


