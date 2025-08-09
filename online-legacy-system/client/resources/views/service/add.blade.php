@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">

            <div class="card mb-0">
                <div class="card-body">
                    <h4 class="card-title">Servis İçeriği Ekle</h4>
                    <hr>
                    <form action="{{asset('add-new-service')}}" class="col-6" method="POST" enctype="multipart/form-data">
                        @csrf
                        <div class="form-group mb-3">
                            <label for="item">Ülke</label>
                            <select name="ulke" class="form-select" id="">
                                @php
                                    $ulkeler = App\Models\Country::all();
                                @endphp
                                @foreach($ulkeler as $ulke)
                                    <option value="{{$ulke->id}}">{{$ulke->title}}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-3">
                            <label for="item">İçerik Adı</label>
                            <input type="text" name="ad" class="form-control">
                        </div>
                        <div class="form-group mb-3">
                            <label for="item">İçerik Bedeli</label>
                            <input type="text" name="bedeli" class="form-control">
                        </div>
                        <div class="form-group mb-3">
                            <label for="item">İçerik Görseli</label>
                            <input type="file" name="gorsel" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary btn-md mt-2">Kaydet</button>
                    </form>

                </div>
            </div>
        </div>
    </div>
@endsection


