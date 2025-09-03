
@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">
            <div class="card mb-0">
                <div class="card-body">
                    <h4 class="card-title">Mail Ayarları</h4>
                    <hr>
                    <form action="{{asset('update-mail')}}" method="POST">
                        @csrf
                        <div class="col-6 form-group mb-3 d-flex align-items-center">
                            <label for="host" class="fw-bold" style="width: 100px">Hostname</label>
                            <input type="text" name="hostname" class="form-control ms-3" value="{{@$mail_tool->host}}">
                        </div>
                        <div class="col-6 form-group mb-3 d-flex align-items-center">
                            <label for="host" class="fw-bold" style="width: 100px">Mail Adresi</label>
                            <input type="text" name="username" class="form-control ms-3" value="{{@$mail_tool->username}}">
                        </div>
                        <div class="col-6 form-group mb-3 d-flex align-items-center">
                            <label for="host" class="fw-bold" style="width: 100px">Mail Şifre</label>
                            <input type="text" name="password" class="form-control ms-3" value="{{@$mail_tool->password}}">
                        </div>
                        <button type="submit" class="btn btn-md btn-primary">Güncelle</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
@endsection
