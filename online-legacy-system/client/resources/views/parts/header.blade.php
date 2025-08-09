<div class="header">

    <div class="header-left active">
        <a href="{{asset('/')}}" class="logo logo-normal">
            <img src="{{asset('logo.svg')}}" alt>
        </a>
        <a href="{{asset('/')}}" class="logo logo-white">
            <img src="{{asset('logo.svg')}}" alt>
        </a>
        <a href="{{asset('/')}}" class="logo-small">
            <img src="{{asset('logo.svg')}}" alt>
        </a>
        <a id="toggle_btn" href="javascript:void(0);">
            <i data-feather="chevrons-left" class="feather-16"></i>
        </a>
    </div>

    <a id="mobile_btn" class="mobile_btn" href="#sidebar">
<span class="bar-icon">
<span></span>
<span></span>
<span></span>
</span>
    </a>

    <ul class="nav user-menu justify-content-end">
        <li class="nav-item dropdown has-arrow main-drop">
            <a href="javascript:void(0);" class="dropdown-toggle nav-link userset" data-bs-toggle="dropdown">
<span class="user-info">
<span class="user-letter">
<img src="{{asset('icon.png')}}" alt class="img-fluid">
</span>
<span class="user-detail">
<span class="user-role">Super Admin</span>
</span>
</span>
            </a>
            <div class="dropdown-menu menu-drop-user">
                <div class="profilename">
                    <div class="profileset">
<span class="user-img"><img src="{{asset('icon.png')}}" alt>
<span class="status online"></span></span>
                        <div class="profilesets">
                            <h5>Super Admin</h5>
                        </div>
                    </div>
                    <hr class="m-0">

                    <a class="dropdown-item logout pb-0" href="{{asset('cikis-yap')}}"><img src="assets/img/icons/log-out.svg" class="me-2" alt="img">Güvenli Çıkış</a>
                </div>
            </div>
        </li>
    </ul>


    <div class="dropdown mobile-user-menu">
        <a href="javascript:void(0);" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v"></i></a>
        <div class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="profile.html">My Profile</a>
            <a class="dropdown-item" href="generalsettings.html">Settings</a>
            <a class="dropdown-item" href="signin.html">Logout</a>
        </div>
    </div>

</div>
