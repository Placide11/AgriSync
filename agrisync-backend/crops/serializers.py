from rest_framework import serializers
from .models import Field, Crop, InputUsed
from inventory.models import InventoryItem 
from inventory.serializers import InventoryItemSerializer

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = '__all__'

class InputUsedSerializer(serializers.ModelSerializer):
    inventory_item = InventoryItemSerializer(read_only=True)

    class Meta:
        model = InputUsed
        fields = ['id', 'inventory_item', 'amount_used', 'date_used']

# 👇 This new serializer is for CREATING a new record.
class InputUsedCreateSerializer(serializers.ModelSerializer):
    inventory_item_id = serializers.PrimaryKeyRelatedField(
        queryset=InventoryItem.objects.all(),
        source='inventory_item',
        write_only=True
    )

    class Meta:
        model = InputUsed
        fields = ['inventory_item_id', 'amount_used', 'date_used']

    def validate(self, data):
        """
        Check that the amount used is not greater than the quantity in stock.
        """
        inventory_item = data['inventory_item']
        amount_used = data['amount_used']
        if amount_used > inventory_item.quantity:
            raise serializers.ValidationError(
                f"Amount used ({amount_used}) cannot be greater than the available stock ({inventory_item.quantity})."
            )
        return data

class CropSerializer(serializers.ModelSerializer):
    field = FieldSerializer(read_only=True)
    field_id = serializers.PrimaryKeyRelatedField(
        queryset=Field.objects.all(), source='field', write_only=True
    )
    inputs_used = InputUsedSerializer(many=True, read_only=True)

    class Meta:
        model = Crop
        fields = ['id', 'name', 'field', 'field_id', 'planting_date',
                  'expected_harvest_date', 'status', 'inputs_used']