<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankService extends Model
{
    protected  $table = 'bank_services';
    public $guarded  = [];
    public $timestamps = true;
}
