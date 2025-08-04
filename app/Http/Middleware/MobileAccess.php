<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MobileAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Deteksi apakah request berasal dari mobile device
        $userAgent = $request->header('User-Agent');
        $isMobile = $this->isMobileDevice($userAgent);
        
        // Tambahkan header untuk mobile detection
        $request->attributes->set('is_mobile', $isMobile);
        
        // Tambahkan CORS headers untuk mobile access
        $response = $next($request);
        
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        
        return $response;
    }

    /**
     * Deteksi mobile device berdasarkan User-Agent
     */
    private function isMobileDevice($userAgent): bool
    {
        if (!$userAgent) {
            return false;
        }

        $mobileKeywords = [
            'android', 'webos', 'iphone', 'ipad', 'ipod', 
            'blackberry', 'iemobile', 'opera mini', 'mobile'
        ];

        $userAgentLower = strtolower($userAgent);
        
        foreach ($mobileKeywords as $keyword) {
            if (strpos($userAgentLower, $keyword) !== false) {
                return true;
            }
        }

        return false;
    }
} 