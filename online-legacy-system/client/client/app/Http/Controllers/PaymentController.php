<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected function create(Request $request){
        $signature = $request->get("signature");
        $passport_name = "";
        if($request->file("passport")){
            $passport_name = $request->file("passport")->getClientOriginalName();
            $file = request()->file('passport');
            $file->storeAs('passports',$passport_name ,['disk' => 'public']);
        }
        $add_services = $request->get("additional_services");
        return $add_services;
    }
}
