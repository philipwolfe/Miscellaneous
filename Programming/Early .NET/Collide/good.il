
Good
   
 .method private hidebysig instance class Collide.Circle
            FindProto() cil managed
    {
      // Code size       583 (0x247)
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
      IL_00c9:  br.s       IL_0133

      IL_00cb:  ldstr      "Index, angle"
      IL_00d0:  call       void [mscorlib]System.Console::WriteLine(string)
      IL_00d5:  ldarg.0
      IL_00d6:  ldfld      int32 Collide.Circle::size
      IL_00db:  conv.r8
      IL_00dc:  ldloc.3
      IL_00dd:  call       float64 [mscorlib]System.Math::Cos(float64)
      IL_00e2:  mul
      IL_00e3:  stloc.s    V_5
      IL_00e5:  ldarg.0
      IL_00e6:  ldfld      int32 Collide.Circle::size
      IL_00eb:  conv.r8
      IL_00ec:  ldloc.3
      IL_00ed:  call       float64 [mscorlib]System.Math::Sin(float64)
      IL_00f2:  mul
      IL_00f3:  stloc.s    V_6
      IL_00f5:  ldloc.1
      IL_00f6:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_00fb:  ldloc.s    V_4
      IL_00fd:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0102:  ldloc.s    V_5
      IL_0104:  call       float64 [mscorlib]System.Math::Round(float64)
      IL_0109:  conv.i4
      IL_010a:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_010f:  ldloc.1
      IL_0110:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_0115:  ldloc.s    V_4
      IL_0117:  ldelema    [System.Drawing]System.Drawing.Point
      IL_011c:  ldloc.s    V_6
      IL_011e:  call       float64 [mscorlib]System.Math::Round(float64)
      IL_0123:  conv.i4
      IL_0124:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_0129:  ldloc.3
      IL_012a:  ldloc.2
      IL_012b:  add
      IL_012c:  stloc.3
      IL_012d:  ldloc.s    V_4
      IL_012f:  ldc.i4.1
      IL_0130:  add
      IL_0131:  stloc.s    V_4
      IL_0133:  ldloc.s    V_4
      IL_0135:  ldarg.0
      IL_0136:  ldfld      int32 Collide.Circle::sides
      IL_013b:  ble.s      IL_00cb

      IL_013d:  ldstr      "FindProto4:"
      IL_0142:  call       void [mscorlib]System.Console::WriteLine(string)
      IL_0147:  ldarg.0
      IL_0148:  ldfld      int32 Collide.Circle::size
      IL_014d:  ldc.i4.1
      IL_014e:  bne.un.s   IL_0179

      IL_0150:  ldloc.1
      IL_0151:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_0156:  ldc.i4.0
      IL_0157:  ldelema    [System.Drawing]System.Drawing.Point
      IL_015c:  ldc.i4.0
      IL_015d:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_0162:  ldloc.1
      IL_0163:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_0168:  ldc.i4.0
      IL_0169:  ldelema    [System.Drawing]System.Drawing.Point
      IL_016e:  ldc.i4.0
      IL_016f:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_0174:  br         IL_0239

      IL_0179:  ldarg.0
      IL_017a:  ldfld      int32 Collide.Circle::size
      IL_017f:  ldc.i4.2
      IL_0180:  bne.un     IL_0239

      IL_0185:  ldloc.1
      IL_0186:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_018b:  ldc.i4.0
      IL_018c:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0191:  ldc.i4.0
      IL_0192:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_0197:  ldloc.1
      IL_0198:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_019d:  ldc.i4.0
      IL_019e:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01a3:  ldc.i4.0
      IL_01a4:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_01a9:  ldloc.1
      IL_01aa:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01af:  ldc.i4.1
      IL_01b0:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01b5:  ldc.i4.1
      IL_01b6:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_01bb:  ldloc.1
      IL_01bc:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01c1:  ldc.i4.1
      IL_01c2:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01c7:  ldc.i4.0
      IL_01c8:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_01cd:  ldloc.1
      IL_01ce:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01d3:  ldc.i4.2
      IL_01d4:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01d9:  ldc.i4.1
      IL_01da:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_01df:  ldloc.1
      IL_01e0:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01e5:  ldc.i4.2
      IL_01e6:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01eb:  ldc.i4.1
      IL_01ec:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_01f1:  ldloc.1
      IL_01f2:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_01f7:  ldc.i4.3
      IL_01f8:  ldelema    [System.Drawing]System.Drawing.Point
      IL_01fd:  ldc.i4.0
      IL_01fe:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_0203:  ldloc.1
      IL_0204:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_0209:  ldc.i4.3
      IL_020a:  ldelema    [System.Drawing]System.Drawing.Point
      IL_020f:  ldc.i4.1
      IL_0210:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_0215:  ldloc.1
      IL_0216:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_021b:  ldc.i4.4
      IL_021c:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0221:  ldc.i4.0
      IL_0222:  call       instance void [System.Drawing]System.Drawing.Point::set_X(int32)
      IL_0227:  ldloc.1
      IL_0228:  ldfld      valuetype [System.Drawing]System.Drawing.Point[] Collide.Circle::shape
      IL_022d:  ldc.i4.4
      IL_022e:  ldelema    [System.Drawing]System.Drawing.Point
      IL_0233:  ldc.i4.0
      IL_0234:  call       instance void [System.Drawing]System.Drawing.Point::set_Y(int32)
      IL_0239:  ldsfld     class [mscorlib]System.Collections.ArrayList Collide.Circle::prototypes
      IL_023e:  ldloc.1
      IL_023f:  callvirt   instance int32 [mscorlib]System.Collections.ArrayList::Add(object)
      IL_0244:  pop
      IL_0245:  ldloc.1
      IL_0246:  ret
    } // end of method Circle::FindProto

