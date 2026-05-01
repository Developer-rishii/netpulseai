import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, BorderRadius, Gradients } from '@/constants/theme';
import { authAPI } from '@/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    setIsLoading(true);
    try {
      const res = await authAPI.login(email, password);
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Login error details:', JSON.stringify({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code,
      }));
      const d = err.response?.data;
      if (err.response?.status === 403 && d?.requiresVerification) {
        setShowOTP(true); setUserEmail(d.email);
        Alert.alert('Verification Required', 'Enter the OTP sent to your email.');
      } else {
        const detail = d?.message || err.message || 'An error occurred';
        Alert.alert('Login Failed', `${detail}\n\n(Status: ${err.response?.status || 'N/A'}, Code: ${err.code || 'N/A'})`);
      }
    } finally { setIsLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) { Alert.alert('Error', 'Enter a 6-digit OTP'); return; }
    setIsLoading(true);
    try {
      const res = await authAPI.verifyOTP(userEmail, otp);
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Failed', err.response?.data?.message || 'Invalid OTP');
    } finally { setIsLoading(false); }
  };

  if (showOTP) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.container}>
        <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={s.otpWrap}>
            <View style={s.otpIcon}><Ionicons name="shield-checkmark" size={40} color={Colors.cyan} /></View>
            <Text style={s.title}>Verify Email</Text>
            <Text style={s.subtitle}>Enter the 6-digit code sent to {userEmail}</Text>
            <View style={s.inputWrap}>
              <Ionicons name="key-outline" size={18} color={Colors.muted} style={s.icoL} />
              <TextInput style={s.input} value={otp} onChangeText={setOtp} placeholder="000000"
                placeholderTextColor={Colors.muted+'60'} keyboardType="number-pad" maxLength={6} />
            </View>
            <TouchableOpacity onPress={handleVerifyOTP} disabled={isLoading} activeOpacity={0.8}>
              <LinearGradient colors={[...Gradients.brand]} start={{x:0,y:0}} end={{x:1,y:0}}
                style={[s.btn, isLoading && s.btnOff]}>
                {isLoading ? <ActivityIndicator color={Colors.background}/> :
                  <><Text style={s.btnTxt}>VERIFY & SIGN IN</Text><Ionicons name="arrow-forward" size={16} color={Colors.background}/></>}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={async()=>{try{await authAPI.resendOTP(userEmail);Alert.alert('Sent','New OTP sent.')}catch{Alert.alert('Error','Could not resend')}}}>
              <Text style={s.linkTxt}>RESEND CODE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setShowOTP(false)}><Text style={s.linkTxt}>← GO BACK</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={s.container}>
      <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={s.glow}/>
        <View style={s.logo}>
          <View style={s.logoIco}><Ionicons name="pulse" size={28} color={Colors.cyan}/></View>
          <Text style={s.eyebrow}>// OPERATOR CONSOLE</Text>
          <Text style={s.title}>Sign in to NetPulse AI</Text>
          <Text style={s.subtitle}>Access your network intelligence workspace.</Text>
        </View>
        <View style={s.form}>
          <View>
            <Text style={s.lbl}>WORK EMAIL</Text>
            <View style={s.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={Colors.muted} style={s.icoL}/>
              <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="you@operator.com"
                placeholderTextColor={Colors.muted+'60'} keyboardType="email-address" autoCapitalize="none"/>
            </View>
          </View>
          <View>
            <Text style={s.lbl}>PASSWORD</Text>
            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} style={s.icoL}/>
              <TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="••••••••••••"
                placeholderTextColor={Colors.muted+'60'} secureTextEntry={!showPassword}/>
              <TouchableOpacity onPress={()=>setShowPassword(!showPassword)} style={{padding:8}}>
                <Ionicons name={showPassword?'eye-off-outline':'eye-outline'} size={18} color={Colors.muted}/>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogin} disabled={isLoading} activeOpacity={0.8}>
            <LinearGradient colors={[...Gradients.brand]} start={{x:0,y:0}} end={{x:1,y:0}}
              style={[s.btn, isLoading && s.btnOff]}>
              {isLoading ? <ActivityIndicator color={Colors.background}/> :
                <><Text style={s.btnTxt}>SIGN IN</Text><Ionicons name="arrow-forward" size={16} color={Colors.background}/></>}
            </LinearGradient>
          </TouchableOpacity>
          <View style={s.divider}><View style={s.divLine}/><Text style={s.divTxt}>OR</Text><View style={s.divLine}/></View>
          <TouchableOpacity style={s.sso} activeOpacity={0.7}>
            <Ionicons name="lock-closed" size={16} color={Colors.foreground}/>
            <Text style={{fontSize:14,color:Colors.foreground}}>Continue with SSO</Text>
          </TouchableOpacity>
        </View>
        <View style={s.footer}>
          <Text style={{fontSize:13,color:Colors.muted}}>New to NetPulse? </Text>
          <Link href="/register" asChild><TouchableOpacity><Text style={{fontSize:13,color:Colors.cyan,fontWeight:'600'}}>Request access</Text></TouchableOpacity></Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.background},
  scrollContent:{flexGrow:1,justifyContent:'center',padding:24},
  glow:{position:'absolute',top:-100,alignSelf:'center',width:300,height:300,borderRadius:150,backgroundColor:Colors.cyan+'08'},
  logo:{alignItems:'center',marginBottom:32,gap:8},
  logoIco:{width:56,height:56,borderRadius:16,backgroundColor:Colors.cyanDim,justifyContent:'center',alignItems:'center',marginBottom:12,borderWidth:1,borderColor:Colors.borderCyan},
  eyebrow:{fontFamily:'SpaceMono',fontSize:10,letterSpacing:2,color:Colors.cyan},
  title:{fontSize:24,fontWeight:'700',color:Colors.foreground,letterSpacing:-0.5,textAlign:'center'},
  subtitle:{fontSize:14,color:Colors.muted,textAlign:'center'},
  form:{gap:20},
  lbl:{fontFamily:'SpaceMono',fontSize:9,letterSpacing:2,color:Colors.muted,marginBottom:8},
  inputWrap:{flexDirection:'row',alignItems:'center',backgroundColor:Colors.surface,borderRadius:12,borderWidth:1,borderColor:Colors.border,paddingHorizontal:12},
  icoL:{marginRight:8},
  input:{flex:1,paddingVertical:14,fontSize:14,color:Colors.foreground},
  btn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:14,borderRadius:12},
  btnOff:{opacity:0.6},
  btnTxt:{fontFamily:'SpaceMono',fontSize:12,fontWeight:'700',letterSpacing:2,color:Colors.background},
  divider:{flexDirection:'row',alignItems:'center',gap:12},
  divLine:{flex:1,height:1,backgroundColor:Colors.border},
  divTxt:{fontFamily:'SpaceMono',fontSize:9,letterSpacing:2,color:Colors.muted},
  sso:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:12,borderRadius:12,borderWidth:1,borderColor:Colors.border,backgroundColor:Colors.surface+'60'},
  footer:{flexDirection:'row',justifyContent:'center',marginTop:32},
  otpWrap:{alignItems:'center',gap:16},
  otpIcon:{width:72,height:72,borderRadius:36,backgroundColor:Colors.cyanDim,justifyContent:'center',alignItems:'center',marginBottom:12},
  linkTxt:{fontFamily:'SpaceMono',fontSize:10,letterSpacing:2,color:Colors.muted,paddingVertical:8},
});
