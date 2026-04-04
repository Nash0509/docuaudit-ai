import os
import json
import uuid
from datetime import datetime

REGISTRY_FILE = "document_registry.json"
UPLOAD_DIR = "uploads"


class DocumentRegistry:

    def __init__(self):

        if not os.path.exists(REGISTRY_FILE):

            with open(REGISTRY_FILE,"w") as f:

                json.dump({},f)


    def load(self):

        with open(REGISTRY_FILE,"r") as f:

            return json.load(f)


    def save(self,data):

        with open(REGISTRY_FILE,"w") as f:

            json.dump(data,f,indent=2)


    def register_document(self, filename:str):

        data=self.load()

        document_id=str(uuid.uuid4())

        data[document_id]={

            "filename":filename,

            "status":"uploaded",

            "uploaded_at":datetime.utcnow().isoformat(),

            "chunks":0,

            "audited":False,

            "audit_result":None

        }

        self.save(data)

        return document_id


    def update_status(self, document_id, status):

        data=self.load()

        if document_id in data:

            data[document_id]["status"]=status

            self.save(data)


    def update_chunks(self, document_id, count):

        data=self.load()

        if document_id in data:

            data[document_id]["chunks"]=count

            data[document_id]["status"]="indexed"

            self.save(data)


    def mark_audited(self, document_id):

        data=self.load()

        if document_id in data:

            data[document_id]["audited"]=True

            self.save(data)


    def store_audit_result(self, document_id, result):

        data=self.load()

        if document_id in data:

            data[document_id]["audit_result"]=result

            data[document_id]["audited"]=True

            self.save(data)


    def get_audit_result(self, document_id):

        data=self.load()

        if document_id in data:

            return data[document_id].get("audit_result")

        return None


    def get(self,document_id):

        data=self.load()

        return data.get(document_id)


    def list(self):

        return self.load()
    

    def delete(self, document_id):

     data = self.load()

     if document_id in data:

        del data[document_id]

        self.save(data)

        return True

     return False



def delete_file(document_id):

    path = os.path.join(
        UPLOAD_DIR,
        f"{document_id}.pdf"
    )

    if os.path.exists(path):

        os.remove(path)

document_registry=DocumentRegistry()