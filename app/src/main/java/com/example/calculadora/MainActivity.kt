package com.example.calculadora

import android.icu.text.DecimalFormat
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {

    val SUMA = "+"
    val RESTA = "-"
    val MULTIPLICACION = "*"
    val DIVISION = "/"
    val PORCENTAJE = "%"

    var operacionActual = ""

    var primerNumero: Double = Double.NaN
    var segundoNumero: Double = Double.NaN

    lateinit var tv_temp: TextView
    lateinit var tv_result: TextView

    lateinit var formatoDecimal: DecimalFormat

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        formatoDecimal = DecimalFormat("#.###########")
        tv_temp = findViewById(R.id.tv_temp)
        tv_result = findViewById(R.id.tv_result)

    }

    fun cambiarOperador(b: View) {
        if (tv_temp.text.isNotEmpty()  || primerNumero.toString()!="NaN") {
            calcular()
            val boton: Button = b as Button
            if (boton.text.toString().trim() == "÷") {
                operacionActual = "/"
            } else if (boton.text.toString().trim() == "X") {
                operacionActual = "*"
            }  else {
                operacionActual = boton.text.toString().trim()
            }
            if (tv_temp.text.toString().isEmpty()) {
                tv_temp.text = tv_result.text
            }
            tv_result.text = formatoDecimal.format(primerNumero) + operacionActual
            tv_temp.text = ""
        }
    }

    fun calcular() {
        try{
            if (primerNumero.toString() != "NaN") {
                if (tv_temp.text.toString().isEmpty()){
                    tv_temp.text = tv_result.text.toString()
                }
                segundoNumero = tv_temp.text.toString().toDouble()
                tv_temp.text = ""

                when (operacionActual) {
                    "+" -> primerNumero = (primerNumero + segundoNumero)
                    "-" -> primerNumero = (primerNumero - segundoNumero)
                    "/" -> primerNumero = (primerNumero / segundoNumero)
                    "*" -> primerNumero = (primerNumero * segundoNumero)
                    "%" -> primerNumero = (primerNumero % segundoNumero)
                }
            } else {
                primerNumero = tv_temp.text.toString().toDouble()
        }
    }catch (e: Exception){

        }
    }

    fun selecNumero(b: View) {
        val boton: Button = b as Button
        tv_temp.text = tv_temp.text.toString() + boton.text.toString()

    }
    fun igual(b: View) {
        calcular()
        tv_result.text = formatoDecimal.format(primerNumero)
        //primerNumero = Double.NaN
        operacionActual = ""
    }

    fun borrar(b: View) {
        val boton: Button = b as Button
        if (boton.text.toString().trim() == "C") {
            if (tv_temp.text.toString().isNotEmpty()) {
                var dataActual: CharSequence = tv_temp.text as CharSequence
                tv_temp.text = dataActual.subSequence(0, dataActual.length - 1)
            } else {
                primerNumero = Double.NaN
                segundoNumero = Double.NaN
                tv_temp.text = ""
                tv_result.text = ""
            }


        } else if (boton.text.toString().trim() == "CA") {
            primerNumero = Double.NaN
            segundoNumero = Double.NaN
            tv_temp.text = ""
            tv_result.text = ""
        }

    }
}

