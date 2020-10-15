//Copyright (C) 1999-2000 AlphaBlox Corporation, Inc. All rights reserved.
var unicodeSortMap = "";
unicodeSortMap += "\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u000E\u000F";
unicodeSortMap += "\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019";
unicodeSortMap += "\u001A\u001B\u001C\u001D\u001E\u001F\u007F\u0080\u0081\u0082";
unicodeSortMap += "\u0083\u0084\u0085\u0086\u0087\u0088\u0089\u008A\u008B\u008C";
unicodeSortMap += "\u008D\u008E\u008F\u0090\u0091\u0092\u0093\u0094\u0095\u0096";
unicodeSortMap += "\u0097\u0098\u0099\u009A\u009B\u009C\u009D\u009E\u009F\u0027";
unicodeSortMap += "\u002D\u00AD\u0020\u0020\u0009\u0021\u0022\u0023\u0024\u0025";
unicodeSortMap += "\u0026\u0028\u0029\u002A\u002E\u002F\u003A\u003B\u003F\u0040";
unicodeSortMap += "\u005B\u005D\u005E\u005F\u0060\u007B\u007C\u007D\u007E\u00A1";
unicodeSortMap += "\u00A6\u00A8\u00AF\u00B4\u00B8\u00BF\u002B\u003C\u003D\u003E";
unicodeSortMap += "\u00B1\u00AB\u00BB\u00D7\u00F7\u00A2\u00A3\u00A4\u00A5\u00A7";
unicodeSortMap += "\u00A9\u00AE\u00B0\u00B5\u00B7\u0030\u00BC\u00BD\u00BE\u0031";
unicodeSortMap += "\u00B9\u0032\u00B2\u0033\u00B3\u0034\u0035\u0036\u0037\u0038";
unicodeSortMap += "\u0039\u0061\u33C2\u0041\u00AA\u00E1\u00C1\u00E0\u00C0\u00E2";
unicodeSortMap += "\u00C2\u00E4\u00C4\u00E3\u00C3\u00E5\u00C5\u00E6\u00C6\u0062";
unicodeSortMap += "\u0042\u33C3\u0063\u3388\u33C4\u33C5\u339D\u33A0\u33A4\u0043";
unicodeSortMap += "\u33C6\u33C7\u00E7\u00C7\u0064\u3397\u33C8\u0044\u00F0\u00D0";
unicodeSortMap += "\u0065\u0045\u00E9\u00C9\u00E8\u00C8\u00EA\u00CA\u00EB\u00CB";
unicodeSortMap += "\u0066\u3399\u0046\u0067\u0047\u33C9\u3387\u3393\u33AC\u0068";
unicodeSortMap += "\u33CA\u0048\u3390\u33CB\u0069\u33CC\u0049\u00ED\u00CD\u00EC";
unicodeSortMap += "\u00CC\u00EE\u00CE\u00EF\u00CF\u006A\u004A\u006B\u3389\u338F";
unicodeSortMap += "\u3398\u339E\u33A2\u33A6\u33CF\u3384\u3391\u33AA\u33B8\u33BE";
unicodeSortMap += "\u33C0\u004B\u3385\u33CD\u33CE\u006C\u33D0\u33D1\u33D2\u33D3";
unicodeSortMap += "\u004C\u006D\u33A1\u33A5\u33D4\u338E\u33D5\u339C\u339F\u33A3";
unicodeSortMap += "\u33D6\u33A7\u33A8\u33B3\u3383\u33B7\u33BD\u338D\u3395\u339B";
unicodeSortMap += "\u33B2\u3382\u338C\u33B6\u33BC\u004D\u3386\u3392\u3396\u33AB";
unicodeSortMap += "\u33B9\u33BF\u33C1\u006E\u339A\u33B1\u3381\u338B\u33B5\u33BB";
unicodeSortMap += "\u004E\u00F1\u00D1\u006F\u004F\u00BA\u00F3\u00D3\u00F2\u00D2";
unicodeSortMap += "\u00F4\u00D4\u0153\u0152\u00F6\u00D6\u00F5\u00D5\u00F8\u00D8";
unicodeSortMap += "\u0070\u33D8\u33B0\u3380\u338A\u33D7\u33B4\u33BA\u0050\u33A9";
unicodeSortMap += "\u33D9\u33DA\u0071\u0051\u0072\u33AD\u33AE\u33AF\u0052\u0073";
unicodeSortMap += "\u33DB\u0053\u33DC\u00DF\u0074\u0054\u3394\u00FE\u00DE\u0075";
unicodeSortMap += "\u0055\u00FA\u00DA\u00F9\u00D9\u00FB\u00DB\u00FC\u00DC\u0076";
unicodeSortMap += "\u0056\u0077\u0057\u33DD\u0078\u0058\u0079\u0059\u00FD\u00DD";
unicodeSortMap += "\u00FF\u007A\u005A\u3000\u3001\u3002\u3003\u3004\u3005\u3006";
unicodeSortMap += "\u3007\u3008\u3009\u300A\u300B\u300C\u300D\u300E\u300F\u3010";
unicodeSortMap += "\u3011\u3012\u3013\u3014\u3015\u3016\u3017\u3018\u3019\u301A";
unicodeSortMap += "\u301B\u301C\u301D\u301E\u301F\u3020\u3030\u3031\u3032\u3033";
unicodeSortMap += "\u3034\u3035\u3036\u3037\u3220\u3280\u3221\u3281\u3222\u3282";
unicodeSortMap += "\u3223\u3283\u3224\u3284\u3225\u3285\u3226\u3286\u3227\u3287";
unicodeSortMap += "\u3228\u3288\u3229\u3289\u322A\u328A\u322B\u328B\u322C\u328C";
unicodeSortMap += "\u322D\u328D\u322E\u328E\u322F\u328F\u3230\u3290\u3231\u3291";
unicodeSortMap += "\u3232\u3292\u3233\u3293\u3234\u3294\u3235\u3295\u3236\u3296";
unicodeSortMap += "\u3237\u3297\u3238\u3298\u323B\u32AB\u323C\u32AC\u323D\u32AD";
unicodeSortMap += "\u323E\u32AE\u323F\u32AF\u3239\u323A\u3240\u3241\u3242\u3243";
unicodeSortMap += "\u3299\u329A\u329B\u329C\u329D\u329E\u329F\u32A0\u32A1\u32A2";
unicodeSortMap += "\u32A3\u32A4\u32A5\u32A6\u32A7\u32A8\u32A9\u32AA\u32B0\u32C0";
unicodeSortMap += "\u32C1\u32C2\u32C3\u32C4\u32C5\u32C6\u32C7\u32C8\u32C9\u32CA";
unicodeSortMap += "\u32CB\u33E0\u33E1\u33E2\u33E3\u33E4\u33E5\u33E6\u33E7\u33E8";
unicodeSortMap += "\u33E9\u33EA\u33EB\u33EC\u33ED\u33EE\u33EF\u33F0\u33F1\u33F2";
unicodeSortMap += "\u33F3\u33F4\u33F5\u33F6\u33F7\u33F8\u33F9\u33FA\u33FB\u33FC";
unicodeSortMap += "\u33FD\u33FE\u3358\u3359\u335A\u335B\u335C\u335D\u335E\u335F";
unicodeSortMap += "\u3360\u3361\u3362\u3363\u3364\u3365\u3366\u3367\u3368\u3369";
unicodeSortMap += "\u336A\u336B\u336C\u336D\u336E\u336F\u3370\u3041\u3042\u30A1";
unicodeSortMap += "\u30A2\u32D0\u3303\u3300\u3301\u3302\u3043\u3044\u30A3\u30A4";
unicodeSortMap += "\u32D1\u3304\u3305\u3045\u3046\u30A5\u30A6\u32D2\u3306\u3047";
unicodeSortMap += "\u3048\u30A7\u30A8\u32D3\u3308\u3307\u3049\u304A\u30A9\u30AA";
unicodeSortMap += "\u32D4\u330A\u3309\u304B\u30F5\u30AB\u32D5\u330B\u330C\u330D";
unicodeSortMap += "\u304C\u30AC\u330E\u330F\u304D\u30AD\u32D6\u3312\u3314\u3315";
unicodeSortMap += "\u3316\u3317\u304E\u30AE\u3310\u3311\u3313\u304F\u30AF\u32D7";
unicodeSortMap += "\u331C\u331A\u331B\u3050\u30B0\u3318\u3319\u3051\u30F6\u30B1";
unicodeSortMap += "\u32D8\u3052\u30B2\u3053\u30B3\u32D9\u331E\u331D\u3054\u30B4";
unicodeSortMap += "\u3055\u30B5\u32DA\u331F\u3320\u3056\u30B6\u3057\u30B7\u32DB";
unicodeSortMap += "\u3321\u3058\u30B8\u3059\u30B9\u32DC\u305A\u30BA\u305B\u30BB";
unicodeSortMap += "\u32DD\u305C\u30BC\u305D\u30BD\u32DE\u305E\u30BE\u305F\u30BF";
unicodeSortMap += "\u32DF\u3060\u30C0\u3324\u3061\u30C1\u32E0\u3062\u30C2\u3063";
unicodeSortMap += "\u30C3\u3064\u30C4\u32E1\u3065\u30C5\u3066\u30C6\u32E2\u3067";
unicodeSortMap += "\u30C7\u3325\u3068\u30C8\u32E3\u3327\u3069\u30C9\u3326\u306A";
unicodeSortMap += "\u30CA\u32E4\u3328\u306B\u30CB\u32E5\u306C\u30CC\u32E6\u306D";
unicodeSortMap += "\u30CD\u32E7\u306E\u30CE\u32E8\u3329\u306F\u30CF\u32E9\u332A";
unicodeSortMap += "\u3070\u30D0\u332D\u3071\u30D1\u332B\u332C\u3072\u30D2\u32EA";
unicodeSortMap += "\u3073\u30D3\u3331\u3074\u30D4\u332E\u332F\u3330\u3075\u30D5";
unicodeSortMap += "\u32EB\u3332\u3333\u3335\u3076\u30D6\u3334\u3077\u30D7\u3078";
unicodeSortMap += "\u30D8\u32EC\u3336\u3339\u3079\u30D9\u333C\u307A\u30DA\u333B";
unicodeSortMap += "\u3337\u3338\u333A\u307B\u30DB\u32ED\u3341\u3342\u333F\u307C";
unicodeSortMap += "\u30DC\u333E\u307D\u30DD\u333D\u3340\u307E\u30DE\u32EE\u3343";
unicodeSortMap += "\u3344\u3345\u3346\u3347\u307F\u30DF\u32EF\u3348\u3349\u334A";
unicodeSortMap += "\u3080\u30E0\u32F0\u3081\u30E1\u32F1\u334D\u334B\u334C\u3082";
unicodeSortMap += "\u30E2\u32F2\u3083\u30E3\u3084\u30E4\u32F3\u334E\u334F\u3322";
unicodeSortMap += "\u3323\u3085\u30E5\u3086\u30E6\u32F4\u3350\u3087\u30E7\u3088";
unicodeSortMap += "\u30E8\u32F5\u3089\u30E9\u32F6\u308A\u30EA\u32F7\u3351\u3352";
unicodeSortMap += "\u308B\u30EB\u32F8\u3354\u3353\u308C\u30EC\u32F9\u3355\u3356";
unicodeSortMap += "\u308D\u30ED\u32FA\u308E\u30EE\u308F\u30EF\u32FB\u3357\u30F7";
unicodeSortMap += "\u3090\u30F0\u32FC\u30F8\u3091\u30F1\u30F9\u3092\u30F2\u32FE";
unicodeSortMap += "\u30FA\u3093\u30F3\u3094\u30F4\u309B\u309C\u309D\u309E\u30FB";
unicodeSortMap += "\u30FC\u30FD\u30FE";
function localeCompare(Z){
    if(Z == null)
        return - 1;
    var Y = this;
    var X = Z;
    var W = 0;
    var V = /['\s]/gi;
    var U = Y.replace(V, "");
    var T = X.replace(V, "");
    if(U.charAt(0) == "-"){
        U = U.substring(1);
    }
    if(T.charAt(0) == "-"){
        T = T.substring(1);
    }
    var S = (U.length <= T.length) ? U.length : T.length;
    var R = 0;
    var Q = 0;
    var P = U.charAt(0).toLowerCase();
    var O = T.charAt(0).toLowerCase();
    for(W = 0; W < S; W ++ ){
        P = U.charAt(W).toLowerCase();
        O = T.charAt(W).toLowerCase();
        R = unicodeSortMap.indexOf(P);
        Q = unicodeSortMap.indexOf(O);
        if(R !=- 1 && Q !=- 1){
            if(R < Q){
                return - 1;
            }
            else if(R == Q){
                continue;
            }
            else if(R > Q){
                return 1;
            }
        }
        else if(R !=- 1 && Q ==- 1){
            return - 1;
        }
        else if(R ==- 1 && Q ==- 1){
            continue;
        }
        else if(R ==- 1 && Q !=- 1){
            return 1;
        }
    }
    for(W = 0; W < S; W ++ ){
        P = U.charAt(W);
        O = T.charAt(W);
        R = unicodeSortMap.indexOf(P);
        Q = unicodeSortMap.indexOf(O);
        if(R !=- 1 && Q !=- 1){
            if(R < Q)
                return - 1;
            else if(R == Q)
                continue;
            else if(R > Q)
                return 1;
        }
        else if(R !=- 1 && Q ==- 1){
            return - 1;
        }
        else if(R ==- 1 && Q ==- 1){
            continue;
        }
        else if(R ==- 1 && Q !=- 1){
            return 1;
        }
    }
    if(Y < X)
        return - 1;
    else if(Y == X)
        return 0;
    else if(Y > X)
        return 1;
}
String.prototype.localeCompare = localeCompare;