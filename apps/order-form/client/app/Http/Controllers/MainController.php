<?php

namespace App\Http\Controllers;

use App\Mail\PaymentMail;
use App\Models\AdditionalService;
use App\Models\BankService;
use App\Models\Country;
use App\Models\Kvkk;
use App\Models\MailTool;
use App\Models\PackageItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class MainController extends Controller
{
    public function login(Request $request){
        return  view('login');
    }
    public function home(Request $request){
        $data['total_payment'] = Payment::count();
        $data['total_pay_amount'] = DB::table('payments')->where('state','success')->sum('amount');
        $data['total_country'] = Country::count();
        $data['total_bank'] = BankService::count();
        $data['son_odemeler'] = Payment::orderBy('created_at','DESC')->take(10)->get();
        $data['title'] = "Yönetim Paneli";
        return view('home',$data);
    }

    public function countries(Request $request){
        $data['title'] = "Ülkeler";
        $data['ulkeler'] = Country::orderBy('created_at','DESC')->get();
        return view('country',$data);
    }

    public function editCountry(Request $request){
        $data['title'] = "Ülke Düzenle";
        $country_id = $request->get('cid');
        $country = Country::find($country_id);
        $data['country'] = $country;
        return view('country.edit',$data);
    }

    public function goBanks(Request $request){
        $data['title'] = "Banka Servisleri Listele";
        $servisler = BankService::orderBy('id','DESC')->get();
        $data['servisler'] = $servisler;
        $data['ulkeler'] = Country::all();
        return view('bank.list',$data);
    }

    public function editBank(Request $request){
        $bank_id = $request->get('bid');
        $bank = BankService::find($bank_id);
        $data['title'] = "Banka Servisi Düzenle";
        $data['banka'] = $bank;
        return view('bank.edit',$data);
    }

    public function packageItems(Request $request){
        $data['title'] = "Paket İçeriği Listesi";
        $items = PackageItem::orderBy('id','ASC')->get();
        $data['items'] = $items;
        return view('items.list',$data);
    }
    public function  deleteItem(Request $request){
        $id = $request->get('item');
        $model = PackageItem::find($id);
        $model->delete();
        return redirect()->back();
    }
    public function additionalService(Request $request){
        $hizmetler = AdditionalService::all();
        $data['title'] = "Ek Hizmetler Listesi";
        $data['hizmetler'] = $hizmetler;
        return view('additional.list',$data);
    }

    public  function editAdditional(Request $request){
        $id = $request->get('id');
        $hizmet = AdditionalService::find($id);
        $data['hizmet'] = $hizmet;
        $data['title'] = "Ek Hizmet Düzenle";
        return view('additional.edit',$data);
    }

    public function listPayment(Request $request){
        $data['title'] = "Ödeme Listesi";
        $payments = Payment::all();
        $data['payments'] = $payments;
        return view('payment.list',$data);
    }

    public function exit(Request $request){
        $request->session()->forget('login');
        return redirect()->route('loginroute');
    }

    public function sendPayMail(Request $request){
        $pid = $request->get('pid');
        $payment = Payment::find($pid);
        $amount = $payment->amount;
        $order_no = $payment->order_no;
        $details = [
            'siparis_no' => $order_no,
            'amount' => $amount
        ];
        $to = $payment->email;
        Mail::to($to)->send(new PaymentMail($order_no,$amount));
        return 'gonderildi';

    }

    public function mailTools(Request $request){
        $data['title'] = "Mail Ayarları";
        $data['mail_tool'] = MailTool::first();
        return view('mailtools',$data);
    }

    public function uploadedfiles(Request $request){
        $data['title'] = "Yüklenen Belgeler";
        $data['payments'] = Payment::all();
        return view('files',$data);
    }
    public function kvkkAyar(Request $request){
        $data['title'] = "KVKK Ayarları";
        $data['kvkk'] = Kvkk::first();
        return view('kvkk',$data);
    }

    public function addNewItem(Request $request){
        $data['title'] = "Yeni İçerik Ekle";
        return view('items.add',$data);
    }
    public function addnewServe(Request $request){
        $data['title'] = "Yeni Hizmet Ekle";
        return view('service.add',$data);
    }


}
