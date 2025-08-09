@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">
            <div class="card mb-0">
                <div class="card-body">
                    <div class="container text-end mt-3">
                        <a href="{{asset('ulkeler')}}" class="btn btn-primary">Ülke Listesine Dön</a>
                    </div>
                    <h4 class="card-title">Ülke Düzenle</h4>
                    <form action="{{asset('edit-country')}}" method="POST">
                        @csrf
                        <input type="hidden" name="country_id" value="{{$country->id}}">
                        <div class="form-group mb-3">
                            <label for="title">Ülke Adı</label>
                            <input type="text" name="ulke_adi" value="{{$country->title}}" class="form-control">
                        </div>
                        <div class="form-group mb-3">
                            <div>
                                <img src="{{ url(env('PROXY_URL').$country->flag) }}" class="img-fluid" width="30" alt="">
                            </div>
                            <label for="bayrak">Ülke Bayrağı Adı Girin(örn:122.png)</label>
                            <input type="text" name="bayrak" placeholder="{{$country->flag}}" class="form-control">
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="onerilen" value="" id="flexCheckChecked" checked="{{$country->recommended == 1 ? true : false}}">
                            <label class="form-check-label" for="flexCheckChecked">
                                Önerilen Ülke
                            </label>
                        </div>
                        <div class="form-group mb-3 text-center">
                            <button type="submit" class="btn btn-md btn-primary w-25">Kaydet</button>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    </div>
@endsection
