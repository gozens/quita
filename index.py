from os import rename
# from os import getcwd
from repertoire import cheminAll
from repertoire import __veri_nom__
from repertoire import effter
effter()

f = cheminAll('lahou\\img')
x = 1

for i in f:
    n = __veri_nom__(i)