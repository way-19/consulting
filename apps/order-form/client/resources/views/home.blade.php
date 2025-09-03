@extends('master')
@section('content')
    <div class="page-wrapper">
        <div class="content">
            <div class="row">
                <div class="col-lg-3 col-sm-6 col-12">
                    <div class="dash-widget">
                        <div class="dash-widgetimg">
                            <span><img src="{{asset('assets/img/icons/dash1.svg')}}" alt="img"></span>
                        </div>
                        <div class="dash-widgetcontent">
                            <h5><span class="counters" data-count="{{$total_payment}}">{{$total_payment}}</span></h5>
                            <h6>Toplam Ödeme Adedi</h6>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 col-12">
                    <div class="dash-widget dash1">
                        <div class="dash-widgetimg">
                            <span><img src="assets/img/icons/dash2.svg" alt="img"></span>
                        </div>
                        <div class="dash-widgetcontent">
                            <h5>$<span class="counters" data-count="{{$total_pay_amount}}">${{$total_pay_amount}}</span></h5>
                            <h6>Toplam Ödeme Tutarı</h6>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 col-12">
                    <div class="dash-widget dash2">
                        <div class="dash-widgetimg">
                            <span><img src="assets/img/icons/dash3.svg" alt="img"></span>
                        </div>
                        <div class="dash-widgetcontent">
                            <h5><span class="counters" data-count="{{$total_country}}">{{$total_country}}</span></h5>
                            <h6>Toplam Ülke</h6>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 col-12">
                    <div class="dash-widget dash3">
                        <div class="dash-widgetimg">
                            <span><img src="assets/img/icons/dash4.svg" alt="img"></span>
                        </div>
                        <div class="dash-widgetcontent">
                            <h5><span class="counters" data-count="{{$total_bank}}">{{$total_bank}}</span></h5>
                            <h6>Toplam Banka</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card mb-0">
                <div class="card-body">
                    <h4 class="card-title">Son Ödemeler</h4>
                    <div class="table-responsive dataview">
                        <table class="table datatable ">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Ödeme Miktarı</th>
                                <th>Ödeme Durumu</th>
                                <th>Ödeme Zamanı</th>
                            </tr>
                            </thead>
                            <tbody>
                                    @foreach($son_odemeler as $son_odeme)
                                        <tr>
                                            <td>1</td>
                                            <td><a href="javascript:void(0);">#{{$son_odeme->id}}</a></td>
                                            <td class="productimgname">
                                                <a>{{$son_odeme->status}}</a>
                                            </td>
                                            <td>{{$son_odeme->created_at}}</td>

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
