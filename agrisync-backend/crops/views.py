from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Field, Crop, InputUsed
from .serializers import FieldSerializer, CropSerializer, InputUsedCreateSerializer

class FieldViewSet(viewsets.ModelViewSet):
    queryset = Field.objects.all()
    serializer_class = FieldSerializer
    permission_classes = [permissions.IsAuthenticated]

class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [permissions.IsAuthenticated]

class AddInputToCropAPIView(generics.CreateAPIView):
    """
    API endpoint to add an input used for a specific crop.
    Also updates the inventory quantity.
    """
    serializer_class = InputUsedCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        crop = get_object_or_404(Crop, pk=self.kwargs['crop_pk'])

        input_used = serializer.save(crop=crop)

        inventory_item = input_used.inventory_item
        inventory_item.quantity -= input_used.amount_used
        inventory_item.save()