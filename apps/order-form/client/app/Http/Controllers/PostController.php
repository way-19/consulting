<?php

namespace App\Http\Controllers;

use App\Models\AdditionalService;
use App\Models\Admin;
use App\Models\BankService;
use App\Models\Country;
use App\Models\Kvkk;
use App\Models\MailTool;
use App\Models\PackageItem;
use Illuminate\Http\Request;

class PostController extends Controller
{
    protected function login(Request $request){
        $email = $request->get('email');
        $password = $request->get('password');
        $kontrol = Admin::where(['eposta' => $email,'pass' => md5($password)]);
        if($kontrol->count() == 0) return redirect()->back()->with('message','Giriş yapmaya yetkiniz bulunmamaktadır.');
        $data['admin'] = $kontrol->first();
        $request->session()->put('login',true);
        return redirect()->route('homeroute');

    }

    protected  function editCountry(Request $request){
        $id = $request->get('country_id');
        $ulke_adi = $request->get('ulke_adi');
        $bayrak_adi = $request->get('bayrak');
        if($request->has('onerilen')){
            $onerilen = 1;
        }else{
            $onerilen = 0;
        }

        $model = Country::find($id);
        $model->title = $ulke_adi;
        $model->flag = $bayrak_adi;
        $model->recommended = $onerilen;
        $model->save();
        return redirect()->back();

    }

    protected  function  editBank(Request $request){
        $id = $request->get('banka_id');
        $name = $request->get('bank_name');
        $price = $request->get('price');
        $bayrak = $request->get('flag');
        $banka = BankService::find($id);
        $banka->name = $name;
        $banka->price = $price;
        $banka->flag = $bayrak;
        $banka->update();
        return redirect()->back();
    }

    public  function editAdditional(Request $request){
        $id = $request->get('hizmet_id');
        $ad = $request->get('hizmet_adi');
        $bedeli = $request->get('bedel');
        $hizmet = AdditionalService::find($id);
        $hizmet->title = $ad;
        $hizmet->price = $bedeli;
        $hizmet->update();
        return redirect()->back();
    }

    public function updateMail(Request $request){
        $host = $request->hostname;
        $user = $request->username;
        $password = $request->password;
        $kontrol = MailTool::first();
        if(!$kontrol){
            $model = new MailTool;
            $model->host = $host;
            $model->port = "587";
            $model->username = $user;
            $model->password = $password;
            $model->save();
        }else{
            $model = MailTool::first();
            $model->host = $host;
            $model->username = $user;
            $model->password = $password;
            $model->update();
        }

        return redirect()->back();
    }

    public function updatekvkk(Request $request){
        $id = $request->get('id');
        $kvkk = Kvkk::find($id);
        $kvkk->link = $request->get('link');
        $kvkk->metin = $request->get('policy');
        $kvkk->update();
        return redirect()->back()->with('message','Güncelleme başarılı!');
    }

    public function addNew(Request $request){
        $ad = $request->get('ad');
        $item = new PackageItem;
        $item->package_id = 1;
        $item->name = $ad;
        $item->save();
        return redirect()->route('itemlistroute');
    }

    public function addService(Request $request){
        $ulke = $request->get('ulke');
        $adi = $request->get('ad');
        $bedel = $request->get('bedeli');
        if($request->hasFile('gorsel')){
            $resim_adi = $request->file('gorsel')->getClientOriginalName();
        }else{
            $resim_adi = "";
        }
        $serv = new AdditionalService;
        $serv->country = $ulke;
        $serv->title = $adi;
        $ser->image = $resim_adi;
        $serv->price = $bedel;
        $serv->save();

    }


}
