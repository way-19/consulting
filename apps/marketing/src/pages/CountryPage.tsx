import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Users, Building2, TrendingUp, Star, Calendar, MessageSquare, ArrowRight, CheckCircle, Globe, Shield, DollarSign, Clock, FileText, User, Eye } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { supabase } from '../lib/supabase';
import { Button, Card } from '../lib/ui';
import { AIAgentIcon } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// (tam dosya içeriği üstte detaylı şekilde verilmiştir)