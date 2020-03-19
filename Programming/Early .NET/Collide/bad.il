
    .method private hidebysig instance class Collide.Circle
            FindProto() cil managed
    {
      // Code size       573 (0x23d)
      .maxstack  3
      .locals (class Collide.Circle V_0,
               class Collide.Circle V_1,
               float64 V_2,
               float64 V_3,
               int32 V_4,
               float64 V_5,
               float64 V_6,
               class [mscorlib]System.Collections.IEnumerator V_7)
      IL_0000:  ldstr      "FindProto: {0} {1}"
      IL_0005:  ldarg.0
      IL_0006:  ldfld      int32 Collide.Circle::size
      IL_000b:  box        [mscorlib]System.Int32
      IL_0010:  ldarg.0
      IL_0011:  ldfld      int32 Collide.Circle::sides
      IL_0016:  box        [mscorlib]System.Int32
      IL_001b:  call       void [mscorlib]System.Console::WriteLine(string,
                                                                    object,
                                                                    object)
      IL_0020:  ldsfld     class [mscorlib]System.Collections.ArrayList Collide.Circle::prototypes
      IL_0025:  callvirt   instance class [mscorlib]System.Collections.IEnumerator [mscorlib]System.Collections.ArrayList::GetEnumerator()
      IL_002a:  stloc.s    V_7
      IL_002c:  br.s       IL_0059

      IL_002e:  ldloc.s    V_7
      IL_0030:  callvirt   instance object [mscorlib]System.Collections.IEnumerator::get_Current()
      IL_0035:  castclass  Collide.Circle
      IL_003a:  stloc.0
      IL_003b:  ldloc.0
      IL_003c:  ldfld      int32 Collide.Circle::sides
      IL_0041:  ldarg.0
      IL_0042:  ldfld      int32 Collide.Circle::sides
      IL_0047:  bne.un.s   IL_0059

      IL_0049:  ldloc.0
      IL_004a:  ldfld      int32 Collide.Circle::size
      IL_004f:  ldarg.0
      IL_0050:  ldfld      int32 Collide.Circle::size
      IL_0055:  bne.un.s   IL_0059

      IL_0057:  ldloc.0
      IL_0058:  ret

      IL_0059:  ldloc.s    V_7
      IL_005b:  callvirt   instance bool [mscorlib]System.Collections.IEnumerator::MoveNext()
      IL_0060:  brtrue.s   IL_002e

      IL_0062:  ldstr      "FindProto2:"
      IL_0067:  call       void [mscorlib]System.Console::WriteLine(string)
      IL_006c:  newobj     instance void Collide.Circle::.ctor()
      IL_0071:  stloc.1
      IL_0072:  ldloc.1
      IL_0073:  ldarg.0
      IL_0074:  ldfld      int32 Collide.Circle::sides
      IL_0079:  stfld      int32 Collide.Circle::sides
      IL_007e:  ldloc.1
      IL_007f:  ldarg.0
      IL_0080:  ldfld      int32 Collide.Circle::size
      IL_0085:  stfld      int32 Collide.Circle::size
      IL_008a:  ldloc.1
      IL_008b:  ldarg.0
      IL_008c:  ldfld      int32 Collide.Circle::sides
      IL_0091:  ldc.i4.1
      IL_0092:  add
      IL_0093:  conv.ovf.u4
      IL_0094:  newarr     [System.Drawing]System.Drawing.Point
      IL_0099:  stfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_009e:  ldstr      "FindProto3:"
      IL_00a3:  call       void [mscorlib]System.Console::WriteLine(string)
      IL_00a8:  ldc.r8     6.2831799999999998
      IL_00b1:  ldarg.0
      IL_00b2:  ldfld      int32 Collide.Circle::sides
      IL_00b7:  conv.r8
      IL_00b8:  div
      IL_00b9:  stloc.2
      IL_00ba:  ldloc.2
      IL_00bb:  ldc.r8     2.
      IL_00c4:  div
      IL_00c5:  stloc.3
      IL_00c6:  ldc.i4.0
      IL_00c7:  stloc.s    V_4
      IL_00c9:  br.s       IL_0129

      IL_00cb:  ldarg.0
      IL_00cc:  ldfld      int32 Collide.Circle::size
      IL_00d1:  conv.r8
      IL_00d2:  ldloc.3
      IL_00d3:  call       float64 [mscorlib]System.Math::Cos(float64)
      IL_00d8:  mul
      IL_00d9:  stloc.s    V_5
      IL_00db:  ldarg.0
      IL_00dc:  ldfld      int32 Collide.Circle::size
      IL_00e1:  conv.r8
      IL_00e2:  ldloc.3
      IL_00e3:  call       float64 [mscorlib]System.Math::Sin(float64)
      IL_00e8:  mul
      IL_00e9:  stloc.s    V_6
      IL_00eb:  ldloc.1
      IL_00ec:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_00f1:  ldloc.s    V_4
      IL_00f3:  ldelema    [System.Drawing]System.Drawing.Point
      IL_00f8:  ldloc.s    V_5
      IL_00fa:  call       float64 [mscorlib]System.Math::Round(float64)
      IL_00ff:  conv.i4
      IL_0100:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_0105:  ldloc.1
      IL_0106:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_010b:  ldloc.s    V_4
      IL_010d:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0112:  ldloc.s    V_6
      IL_0114:  call       float64 [mscorlib]System.Math::Round(float64)
      IL_0119:  conv.i4
      IL_011a:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_011f:  ldloc.3
      IL_0120:  ldloc.2
      IL_0121:  add
      IL_0122:  stloc.3
      IL_0123:  ldloc.s    V_4
      IL_0125:  ldc.i4.1
      IL_0126:  add
      IL_0127:  stloc.s    V_4
      IL_0129:  ldloc.s    V_4
      IL_012b:  ldarg.0
      IL_012c:  ldfld      int32 Collide.Circle::sides
      IL_0131:  ble.s      IL_00cb

      IL_0133:  ldstr      "FindProto4:"
      IL_0138:  call       void [mscorlib]System.Console::WriteLine(string)
      IL_013d:  ldarg.0
      IL_013e:  ldfld      int32 Collide.Circle::size
      IL_0143:  ldc.i4.1
      IL_0144:  bne.un.s   IL_016f

      IL_0146:  ldloc.1
      IL_0147:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_014c:  ldc.i4.0
      IL_014d:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0152:  ldc.i4.0
      IL_0153:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_0158:  ldloc.1
      IL_0159:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_015e:  ldc.i4.0
      IL_015f:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0164:  ldc.i4.0
      IL_0165:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_016a:  br         IL_022f

      IL_016f:  ldarg.0
      IL_0170:  ldfld      int32 Collide.Circle::size
      IL_0175:  ldc.i4.2
      IL_0176:  bne.un     IL_022f

      IL_017b:  ldloc.1
      IL_017c:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_0181:  ldc.i4.0
      IL_0182:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0187:  ldc.i4.0
      IL_0188:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_018d:  ldloc.1
      IL_018e:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_0193:  ldc.i4.0
      IL_0194:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0199:  ldc.i4.0
      IL_019a:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_019f:  ldloc.1
      IL_01a0:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01a5:  ldc.i4.1
      IL_01a6:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01ab:  ldc.i4.1
      IL_01ac:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_01b1:  ldloc.1
      IL_01b2:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01b7:  ldc.i4.1
      IL_01b8:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01bd:  ldc.i4.0
      IL_01be:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_01c3:  ldloc.1
      IL_01c4:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01c9:  ldc.i4.2
      IL_01ca:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01cf:  ldc.i4.1
      IL_01d0:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_01d5:  ldloc.1
      IL_01d6:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01db:  ldc.i4.2
      IL_01dc:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01e1:  ldc.i4.1
      IL_01e2:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_01e7:  ldloc.1
      IL_01e8:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01ed:  ldc.i4.3
      IL_01ee:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01f3:  ldc.i4.0
      IL_01f4:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_01f9:  ldloc.1
      IL_01fa:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01ff:  ldc.i4.3
      IL_0200:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0205:  ldc.i4.1
      IL_0206:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_020b:  ldloc.1
      IL_020c:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_0211:  ldc.i4.4
      IL_0212:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0217:  ldc.i4.0
      IL_0218:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_021d:  ldloc.1
      IL_021e:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_0223:  ldc.i4.4
      IL_0224:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0229:  ldc.i4.0
      IL_022a:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_022f:  ldsfld     class [mscorlib]System.Collections.ArrayList Collide.Circle::prototypes
      IL_0234:  ldloc.1
      IL_0235:  callvirt   instance int32 [mscorlib]System.Collections.ArrayList::Add(object)
      IL_023a:  pop
      IL_023b:  ldloc.1
      IL_023c:  ret
    } // end of method Circle::FindProto

 