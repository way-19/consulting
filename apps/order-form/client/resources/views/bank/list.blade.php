@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">
            <div class="card mb-0">
                <div class="card-body">
                    <h4 class="card-title">Banka Servisleri</h4>
                    <div class="row mb-3">
                        <form action="{{asset('banka-servisleri')}}">
                            <div class="d-flex align-items-center gap-3">
                                <div>
                                    <select name="country" class="form-select" id="">
                                        @foreach($ulkeler as $ulkes)
                                            @if(Request::has('country'))
                                                <option {{Request::get('country') == $ulkes->id ? 'selected' : ''}}  value="{{$ulkes->id}}">{{$ulkes->title}}</option>
                                            @else
                                                <option  value="{{$ulkes->id}}">{{$ulkes->title}}</option>
                                            @endif
                                        @endforeach
                                    </select>
                                </div>
                                <div>
                                    <button type="submit" class="btn btn-sm btn-primary">Filtrele</button>
                                </div>
                            </div>

                        </form>
                    </div>
                    <div class="table-responsive dataview">
                        <table class="table datatable ">
                            <thead>

                            <tr>
                                <th>Banka Adı</th>
                                <th>Banka Bedeli</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            @if(Request::has('country'))
                                @php
                                    $servisler = App\Models\BankService::where('country_id',Request::get('country'))->get();
                                @endphp
                            @endif
                            @foreach($servisler as $servis)
                                <tr>
                                    <td>{{$servis->name}}</td>
                                    <td>${{number_format($servis->price,2)}}</td>
                                    <td>
                                        <a class="text-secondary" href="{{asset('edit-bank?bid='.$servis->id)}}">Düzenle</a>
                                        <a class="ms-5 text-danger" href="{{asset('delete-bank?bid='.$servis->id)}}">Sil</a>
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
