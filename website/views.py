from django.shortcuts import render

def index(request):
    return render(request, 'website/index.html')

def hakkimizda(request):
    return render(request, 'website/hakkimizda.html')

def hizmetler(request):
    return render(request, 'website/hizmetler.html')

def referanslar(request):
    return render(request, 'website/referanslar.html')

def iletisim(request):
    return render(request, 'website/iletisim.html')

def teklif_alin(request):
    return render(request, 'website/teklif-alin.html')
