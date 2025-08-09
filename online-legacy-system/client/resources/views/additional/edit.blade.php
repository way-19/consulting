@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">
            <div class="card mb-0">
                <div class="card-body">
                    <div class="container text-end mt-3">
                        <a href="{{asset('ek-hizmetler')}}" class="btn btn-secondary">Ek Hizmetlere Dön</a>
                    </div>
                    <h4 class="card-title">Ek Hizmet Düzenle</h4>
                    <hr>
                    <form action="{{asset('edit-additional-service')}}" method="POST">
                        @csrf
                        <input type="hidden" name="hizmet_id" value="{{$hizmet->id}}">
                        <div class="form-group mb-3">
                           <div class="row">
                               <div class="col-12 col-lg-6">
                                   <label class="fw-bold" for="hizmet_adi">Hizmet Adı</label>
                                   <input type="text" name="hizmet_adi" value="{{$hizmet->title}}" class="form-control">
                               </div>
                               <div class="col-12 col-lg-6">
                                   <label class="fw-bold" for="bedel">Hizmet Bedeli</label>
                                   <input type="text" name="bedel" value="{{$hizmet->price}}" class="form-control">
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
