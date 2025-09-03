<?php

use App\Models\AdditionalService;
use App\Models\Country;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MainController;
use App\Http\Controllers\PaymentController;
use App\Http\Middleware\AuthControl;
use App\Http\Controllers\PostController;
use App\Models\BankService;

Route::get('login',[MainController::class,'login'])->name('loginroute');
Route::post('login',[PostController::class,'login']);
Route::middleware([AuthControl::class])->group(function(){
    Route::controller(MainController::class)->group(function(){
        Route::get('/','home')->name('homeroute');
        Route::get('ulkeler','countries');
        Route::get('edit-country','editCountry');
        Route::get('banka-servisleri','goBanks');
        Route::get('edit-bank','editBank');
        Route::get('paket-icerigi','packageItems')->name('itemlistroute');
        Route::get('delete-item','deleteItem');
        Route::get('ek-hizmetler','additionalService');
        Route::get('ek-hizmet-duzenle','editAdditional');
        Route::get('odeme-listesi','listPayment');
        Route::get('cikis-yap','exit');
        Route::get('mail-gonder','sendPayMail');
        Route::get('mail-ayarlari','mailTools');
        Route::get('yuklenen-belgeler','uploadedfiles');
        Route::get('kvkk-ayarlari','kvkkAyar');
        Route::get('yeni-icerik-ekle','addNewItem');
        Route::get('hizmet-ekle','addnewServe');
    });


    //post routes
    Route::controller(PostController::class)->group(function(){
        Route::post('/edit-country','editCountry');
        Route::post('/edit-bank','editBank');
        Route::post('edit-additional-service','editAdditional');
        Route::post('update-mail','updateMail');
        Route::post('update-kvkk','updatekvkk');
        Route::post('add-new-item','addNew');
        Route::post('add-new-service','addService');
    });


});

Route::post('/transaction',[PaymentController::class,'create']);