@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">

            <div class="card mb-0">
                <div class="card-body">
                    <h4 class="card-title">Paket İçeriği Ekle</h4>
                    <hr>
                        <form action="{{asset('add-new-item')}}" class="col-6" method="POST">
                            @csrf
                            <div class="form-group mb-3">
                                <label for="item">İçerik Adı</label>
                                <input type="text" name="ad" class="form-control">
                            </div>
                            <button type="submit" class="btn btn-primary btn-md mt-2">Kaydet</button>
                        </form>

                </div>
            </div>
        </div>
    </div>
@endsection


