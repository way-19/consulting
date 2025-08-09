@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">

            <div class="card mb-0">
                <div class="card-body">
                    <div class="container mb-2 text-end">
                        <a href="{{asset('hizmet-ekle')}}" class="btn btn-primary"><i data-feather="plus" ></i>Hizmet Ekle</a>
                    </div>
                    <h4 class="card-title">Ek Hizmetler Listesi</h4>
                    <div class="table-responsive dataview">
                        <table class="table datatable ">
                            <thead>
                            <tr>
                                <th></th>
                                <th>Ülke</th>
                                <th>Hizmet Adı</th>
                                <th>Hizmet Bedeli</th>
                                <th>İşaretli</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                @foreach($hizmetler as $hizmet)
                                    @php
                                        $ulkesi = App\Models\Country::find($hizmet->country);
                                    @endphp
                                    <tr>
                                        <td>#{{$hizmet->id}}</td>
                                        <td>{{$ulkesi->title}}</td>
                                        <td>{{$hizmet->title}}</td>
                                        <td>{{$hizmet->price}}</td>
                                        <td>{{$hizmet->checked == 1 ? "İşaretli" : "-"}}</td>
                                        <td>
                                            <a href="{{asset('ek-hizmet-duzenle?id='.$hizmet->id)}}" class="text-warning">Düzenle</a>
                                            <a href="{{asset('ek-hizmet-sil?id='.$hizmet->id)}}" class="text-danger ms-3">Sil</a>
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


