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

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) { Alert.alert('Error', 'Name, email, and password are required'); return; }
    setIsLoading(true);
    try {
      const res = await authAPI.register({ name, email, password, company: company || undefined });
      if (res.data.requiresVerification) {
        setShowOTP(true);
        setUserEmail(res.data.email);
        Alert.alert('Verify Email', 'An OTP has been sent to your email.');
      }
    } catch (err: any) {
      Alert.alert('Registration Failed', err.response?.data?.message || 'An error occurred');
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
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={s.container}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.otpWrap}>
            <View style={s.otpIcon}><Ionicons name="shield-checkmark" size={40} color={Colors.cyan}/></View>
            <Text style={s.title}>Verify Email</Text>
            <Text style={s.subtitle}>Enter the 6-digit code sent to {userEmail}</Text>
            <View style={s.inputWrap}>
              <Ionicons name="key-outline" size={18} color={Colors.muted} style={s.icoL}/>
              <TextInput style={s.input} value={otp} onChangeText={setOtp} placeholder="000000"
                placeholderTextColor={Colors.muted+'60'} keyboardType="number-pad" maxLength={6}/>
            </View>
            <TouchableOpacity onPress={handleVerifyOTP} disabled={isLoading} activeOpacity={0.8}>
              <LinearGradient colors={[...Gradients.brand]} start={{x:0,y:0}} end={{x:1,y:0}} style={[s.btn, isLoading&&s.btnOff]}>
                {isLoading ? <ActivityIndicator color={Colors.background}/> :
                  <><Text style={s.btnTxt}>VERIFY & CONTINUE</Text><Ionicons name="arrow-forward" size={16} color={Colors.background}/></>}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setShowOTP(false)}><Text style={s.linkTxt}>← GO BACK</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.glow}/>
        <View style={s.logo}>
          <View style={s.logoIco}><Ionicons name="person-add" size={28} color={Colors.violet}/></View>
          <Text style={s.eyebrow}>// JOIN THE NETWORK</Text>
          <Text style={s.title}>Create your account</Text>
          <Text style={s.subtitle}>Get started with NetPulse AI monitoring.</Text>
        </View>
        <View style={s.form}>
          {[
            {label:'FULL NAME',value:name,set:setName,icon:'person-outline' as const,ph:'John Doe',kb:'default' as const},
            {label:'WORK EMAIL',value:email,set:setEmail,icon:'mail-outline' as const,ph:'you@operator.com',kb:'email-address' as const},
            {label:'COMPANY (OPTIONAL)',value:company,set:setCompany,icon:'business-outline' as const,ph:'Acme Telecom',kb:'default' as const},
          ].map((f)=>(
            <View key={f.label}>
              <Text style={s.lbl}>{f.label}</Text>
              <View style={s.inputWrap}>
                <Ionicons name={f.icon} size={18} color={Colors.muted} style={s.icoL}/>
                <TextInput style={s.input} value={f.value} onChangeText={f.set} placeholder={f.ph}
                  placeholderTextColor={Colors.muted+'60'} keyboardType={f.kb} autoCapitalize={f.kb==='email-address'?'none':'words'}/>
              </View>
            </View>
          ))}
          <View>
            <Text style={s.lbl}>PASSWORD</Text>
            <View style={s.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} style={s.icoL}/>
              <TextInput style={s.input} value={password} onChangeText={setPassword} placeholder="Min 6 characters"
                placeholderTextColor={Colors.muted+'60'} secureTextEntry={!showPassword}/>
              <TouchableOpacity onPress={()=>setShowPassword(!showPassword)} style={{padding:8}}>
                <Ionicons name={showPassword?'eye-off-outline':'eye-outline'} size={18} color={Colors.muted}/>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={handleRegister} disabled={isLoading} activeOpacity={0.8}>
            <LinearGradient colors={[...Gradients.brand]} start={{x:0,y:0}} end={{x:1,y:0}} style={[s.btn, isLoading&&s.btnOff]}>
              {isLoading ? <ActivityIndicator color={Colors.background}/> :
                <><Text style={s.btnTxt}>CREATE ACCOUNT</Text><Ionicons name="arrow-forward" size={16} color={Colors.background}/></>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={s.footer}>
          <Text style={{fontSize:13,color:Colors.muted}}>Already have an account? </Text>
          <Link href="/login" asChild><TouchableOpacity><Text style={{fontSize:13,color:Colors.cyan,fontWeight:'600'}}>Sign in</Text></TouchableOpacity></Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:Colors.background},
  scroll:{flexGrow:1,justifyContent:'center',padding:24},
  glow:{position:'absolute',top:-100,alignSelf:'center',width:300,height:300,borderRadius:150,backgroundColor:Colors.violet+'08'},
  logo:{alignItems:'center',marginBottom:32,gap:8},
  logoIco:{width:56,height:56,borderRadius:16,backgroundColor:Colors.violetDim,justifyContent:'center',alignItems:'center',marginBottom:12,borderWidth:1,borderColor:Colors.borderViolet},
  eyebrow:{fontFamily:'SpaceMono',fontSize:10,letterSpacing:2,color:Colors.violet},
  title:{fontSize:24,fontWeight:'700',color:Colors.foreground,letterSpacing:-0.5,textAlign:'center'},
  subtitle:{fontSize:14,color:Colors.muted,textAlign:'center'},
  form:{gap:18},
  lbl:{fontFamily:'SpaceMono',fontSize:9,letterSpacing:2,color:Colors.muted,marginBottom:8},
  inputWrap:{flexDirection:'row',alignItems:'center',backgroundColor:Colors.surface,borderRadius:12,borderWidth:1,borderColor:Colors.border,paddingHorizontal:12},
  icoL:{marginRight:8},
  input:{flex:1,paddingVertical:14,fontSize:14,color:Colors.foreground},
  btn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:14,borderRadius:12},
  btnOff:{opacity:0.6},
  btnTxt:{fontFamily:'SpaceMono',fontSize:12,fontWeight:'700',letterSpacing:2,color:Colors.background},
  footer:{flexDirection:'row',justifyContent:'center',marginTop:32},
  otpWrap:{alignItems:'center',gap:16},
  otpIcon:{width:72,height:72,borderRadius:36,backgroundColor:Colors.cyanDim,justifyContent:'center',alignItems:'center',marginBottom:12},
  linkTxt:{fontFamily:'SpaceMono',fontSize:10,letterSpacing:2,color:Colors.muted,paddingVertical:8},
});
