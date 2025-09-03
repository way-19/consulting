<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdditionalService extends Model
{
    protected  $table = 'additional_services';
    public $guarded  = [];
    public $timestamps = true;
}
