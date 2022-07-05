import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["sysexpertDB"]
coll = db["sysexpert_data"]

datasetP = []
datasetC = []

for i in coll.find({"premisses": {"$exists": "true"}}, {"_id": 0, "conclusion": 0}):
    datasetP.append(i['premisses'])

for j in coll.find({"conclusion": {"$exists": "true"}}, {"_id": 0, "premisses": 0}):
    datasetC.append(j['conclusion'])

tailleP = len(datasetP)
tailleC = len(datasetC)

# print("PREMISSES :")
# print(datasetP)
# print(tailleP)
# print("CONCLUSIONS :")
# print(datasetC)
# print(tailleC)

print("-----SYSTEME EXPERT-----")
#-------------------------------------
def dansalors(fait):
    numero = 1
    results = list()
    z = 0
    while (z < tailleP):
        if datasetC[z] == fait:
            results.append((datasetP[z], datasetC[z]))
            print("--------fonction dans alors-------")
            print(" result ajoute ", numero)
            numero += 1
            print( "premisses => ",datasetP[z])
            print( "conclusion =>",datasetC[z])
        z += 1
    print("--------fin fonction dans alors-------",results)
    return results
#-------------------------------------
memoire = {}
faits_initiaux = {}
#-------------------------------------
def connais(fait):
    resultat = None
    # interrogation des faits prédéfinis
    if faits_initiaux:
                        resultat = faits_initiaux.get(fait, None)
                        print ("fait initiaux: ")
    # interrogation des faits mémorisés
    if resultat == None and memoire: resultat = memoire.get(fait, None)
    print("resultat",resultat)
    print("memoire",memoire)
    print("-----je connais le fait-------" + fait)
    print(resultat)
    print("------------")
    return resultat

#-------------------------------------
'''
La fonction memorise sauvegarde un fait dans la mémoire.
'''
def memorise(fait, resultat):
    global memoire
    memoire[fait] = resultat
    print ("memoire-------------")
    print (memoire)
    print ("-------------")
#-------------------------------------
'''
La fonction demander interroge l'utilisateur.
'''
def demander(fait, question='Est-il vrai que'):
    REPONSES = {'o': True, 'n': False,}
    while True:
        choice = input("%s '%s' ?[o/n] " % (question, fait)).lower()
        if choice in REPONSES.keys(): return REPONSES[choice]
        else: print (u"Merci de répondre avec 'o' ou 'n'.")
'''
#-------------------------------------
La fonction justifie qui, de manière récursive, vas parcourir les règles en
profondeur pour en déduire le but.
'''
def justifie(fait):
    print(" =============================function  justtifie   || fait = ",fait)
    # contrôle du fait en mémoire
    resultat = connais(fait)
    print("resultat de connais :",resultat)
    if resultat != None:
        print(" je retourne le resultat")
        return resultat
    # détermination des règles possibles pour valider le fait courant
    regles = dansalors(fait)
    print ("fait regles-------------")
    print ("fait     => ",fait)
    print ("regles   =>",regles)
    print ("-------------")
    # si nous sommes en présence d'une racine, poser la question
    if not regles:
        resultat = demander(fait)
        memorise(fait, resultat)
        return resultat
    # évaluation des règles
    print("///////////////////////////////////////////////////////")
    print(regles)
    for premisses, conclusion in regles:
            valider = True
            for f in premisses:
                # parcours en profondeur
                print(" je cherche a justifier  =>",f)
                if not justifie(f):
                    print("justie = not")
                    valider = False
                    break
            if valider:
                print ("memorisation : : '%s' donc '%s'" % ("' et '".join(premisses), fait))
                memorise(fait, True)
                return True
    # aucun(e) fait/règle trouvé(e)
    return False
#-------------------------------------
'''
La fonction depart qui cherche à prouver un des diagnostics.
'''
def depart(diagnostics):
# parcours depuis les faits diagnostics, dpuis les feuilles
    for fait in diagnostics:
        print("-----fait---------")
        print(fait)
        print("--------------------")
        if justifie(fait):
                print ("Conclusion : donc %s" % fait)
                return True
    print (u"Aucun diagnostic ne peut être obtenu")
    return False
#-------------------------------------
'''
Système expert basé sur des listes et des dictionnaires, le fonctionnement reste simple et proche du lisp. Nous effectuons des appels récursifs et manipulons nos règles comme en lisp.
Nous allons donc faire un système expert en chaînage arrière avec parcours en profondeur.
'''
if __name__ == "__main__":
    # affichage des règles
    print (u"---- Règles chargées :")
    x = 0
    while x < tailleP:
        print("si", datasetP[x], "alors", datasetC[x])
        x += 1
    print ("----")
    # nous déterminons les feuilles de l'arbre, les buts, nos animaux
    diagnostics = []
    for k in coll.distinct("conclusion"):
        diagnostics.append(k)
# affichage des diagnostics
    print (u"---- Diagnostics détectés :")
    print (diagnostics)
    print ("--depart-------------------------------------------------------------------------------------------------")
    depart(diagnostics)
