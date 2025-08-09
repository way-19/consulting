
@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">
            <div class="card mb-0">
                <div class="card-body">
                    @if(Request::session()->has('message'))
                        <div class="alert alert-success mb-3">
                            {{Request::session()->get('message')}}
                        </div>
                    @endif
                    <h4 class="card-title">KVKK Ayarları</h4>
                    <hr>
                    <form action="{{asset('update-kvkk')}}" method="POST">
                        @csrf
                        <input type="hidden" name="id" value="{{$kvkk->id}}">
                        <div class="form-group mb-3">
                            <label for="aciklama" class="fw-bold">Politika Metni</label>
                            <input type="text" name="policy" class="form-control" value="{{$kvkk->metin}}">
                        </div>
                        <div class="form-group mb-3">
                            <label for="aciklama" class="fw-bold">Politika Link</label>
                            <input type="text" name="link" class="form-control" value="{{$kvkk->link}}">
                        </div>
                        <button type="submit" class="btn btn-md btn-primary">Güncelle</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
