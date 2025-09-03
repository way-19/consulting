<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageItem extends Model
{
    protected  $table = 'package_items';
    public $guarded  = [];
    public $timestamps = true;
}
