@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">



            <div class="card mb-0">
                <div class="card-body">
                    <h4 class="card-title">Son Ödemeler</h4>
                    <div class="table-responsive dataview">
                        <table class="table datatable ">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Bayrak</th>
                                <th>Ülke Adı</th>
                                <th>Önerilen Durumu</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($ulkeler as $ulke)
                                <tr>
                                    <td>{{$ulke->id}}</td>
                                    <td><img src="{{url(env('PROXY_URL').$ulke->flag)}}" width="30" class="img-fluid" alt=""></td>
                                    <td style="height: 60px;" class="productimgname">
                                        {{$ulke->title}}
                                    </td>
                                    <td>{{$ulke->recommended == 1 ? "Önerilen" : "-"}}</td>
                                    <td>
                                        <a href="{{asset('edit-country?cid='.$ulke->id)}}" class="btn btn-sm">Düzenle</a>
                                        <a href="{{asset('delete-country?cid='.$ulke->id)}}" style="color:red" class="btn btn-sm">Sil</a>
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
