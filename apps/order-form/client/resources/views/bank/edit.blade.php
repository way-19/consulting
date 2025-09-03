@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">
            <div class="card mb-0">
                <div class="card-body">
                    <div class="container text-end mt-3">
                        <a href="{{asset('banka-servisleri')}}" class="btn btn-secondary">Banka Listesine Dön</a>
                    </div>
                    <h4 class="card-title">Banka Düzenle</h4>
                    <form action="{{asset('edit-bank')}}" method="POST">
                        @csrf
                        <input type="hidden" name="banka_id" value="{{$banka->id}}">
                        <div class="form-group mb-3">
                            <div class="row">
                                <div class="col-12 col-lg-4">
                                    <label for="bank_name">Banka Adı</label>
                                    <input type="text" name="bank_name" value="{{$banka->name}}" class="form-control">
                                </div>
                                <div class="col-12 col-lg-4">
                                    <label for="price">Banka Bedeli</label>
                                    <input type="text" name="price" value="{{$banka->price}}" class="form-control">
                                </div>
                                <div class="col-12 col-lg-4">
                                    <label for="flag">Bayrak Adı(örn:abank.png)</label>
                                    <input type="text" name="flag" value="{{$banka->flag}}" class="form-control">
                                </div>
                            </div>
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
